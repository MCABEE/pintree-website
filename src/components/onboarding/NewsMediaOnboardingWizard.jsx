"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Icon from "./Icon";
import Step1OrganisationInfo from "./Step1OrganisationInfo";
import Step2FounderOwner from "./Step2FounderOwner";
import Step3VerificationDocs from "./Step3VerificationDocs";
import Step4ReviewSubmit from "./Step4ReviewSubmit";
import Step5AccountCredentials from "./Step5AccountCredentials";
import {
  INITIAL_APPLICATION_STATE,
  getCachedDraft,
  setCachedDraft,
  sanitizeMockData,
  isDummyOwner,
  isValidRealApplicationId,
  saveStep1,
  modifyStep1,
  saveStep2,
  saveStep3,
  saveDraft,
  getActiveApplication,
  getApplicationById,
  fetchLocations,
} from "@/utils/newsMediaOnboarding";

export default function NewsMediaOnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine initial step from query param if valid (1..5)
  const queryStep = parseInt(searchParams.get("step"), 10);
  const [currentStep, setCurrentStep] = useState(
    !isNaN(queryStep) && queryStep >= 1 && queryStep <= 5 ? queryStep : 1
  );

  const [formData, setFormData] = useState(INITIAL_APPLICATION_STATE);

  // Restore cached draft and hydrate from live backend application on mount
  useEffect(() => {
    let isMounted = true;
    async function restoreSession() {
      // 1. Check local cache first for instant display
      const rawCached = getCachedDraft();
      const cached = sanitizeMockData(rawCached);
      if (cached && isMounted) {
        setFormData((prev) => ({ ...prev, ...cached }));
      }

      if (cached?.currentStep && cached.currentStep >= 1 && cached.currentStep <= 5 && isNaN(queryStep)) {
        setCurrentStep(cached.currentStep);
      }

      // 2. Hydrate from live backend API (GET /:id or GET /active) so Edit Step 1 / reload always shows real saved data
      try {
        const storedAppId =
          cached?.applicationId ||
          (typeof window !== "undefined" ? localStorage.getItem("pintree_application_id") : null);

        let remoteRes = null;
        if (storedAppId && isValidRealApplicationId(storedAppId)) {
          remoteRes = await getApplicationById(storedAppId);
        } else {
          remoteRes = await getActiveApplication();
        }

        const remoteData = remoteRes?.data;
        if (isMounted && remoteData && (remoteData.applicationId || remoteData.publicationName)) {
          setFormData((prev) => {
            const safeRemote = sanitizeMockData(remoteData);
            const merged = {
              ...prev,
              ...safeRemote,
              // Keep valid connected owner if backend row hasn't linked applicantUserId yet
              owner:
                safeRemote?.owner && !isDummyOwner(safeRemote.owner)
                  ? safeRemote.owner
                  : prev?.owner && !isDummyOwner(prev.owner)
                  ? prev.owner
                  : cached?.owner && !isDummyOwner(cached.owner)
                  ? cached.owner
                  : null,
              // Preserve human-readable names if cached locally while backend only returned IDs
              primaryLanguageName: prev.primaryLanguageName || cached?.primaryLanguageName || "",
              primaryLanguage: prev.primaryLanguage || cached?.primaryLanguage || "",
              countryName: safeRemote.countryName || prev.countryName || cached?.countryName || "",
              stateName: safeRemote.stateName || prev.stateName || cached?.stateName || "",
              districtName: safeRemote.districtName || prev.districtName || cached?.districtName || "",
            };
            merged.isAccountConnected = Boolean(merged.owner);
            setCachedDraft(merged);
            return merged;
          });
        }
      } catch (e) {
        console.warn("[restoreSession API sync]:", e);
      }
    }
    restoreSession();
    return () => {
      isMounted = false;
    };
  }, [queryStep]);

  // Sync step from URL parameter changes
  useEffect(() => {
    const qStep = parseInt(searchParams.get("step"), 10);
    if (!isNaN(qStep) && qStep >= 1 && qStep <= 5) {
      setCurrentStep(qStep);
    }
  }, [searchParams]);

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [step1Error, setStep1Error] = useState("");

  // Sync step changes with URL query string
  const goToStep = async (step) => {
    setStep1Error("");
    setCurrentStep(step);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const url = new URL(window.location.href);
      url.searchParams.set("step", step.toString());
      window.history.pushState({}, "", url.toString());
    }

    // When navigating to Step 1 (e.g. via "Edit Step 1" on Step 4), ensure Step 1 fields are hydrated from API if missing
    if (step === 1 && (!formData?.publicationName || !formData?.countryId)) {
      try {
        const appId =
          formData?.applicationId ||
          (typeof window !== "undefined" ? localStorage.getItem("pintree_application_id") : null);
        const res = appId && isValidRealApplicationId(appId)
          ? await getApplicationById(appId)
          : await getActiveApplication();
        if (res?.data && (res.data.applicationId || res.data.publicationName)) {
          handleUpdate(sanitizeMockData(res.data));
        }
      } catch {}
    }
  };

  const handleUpdate = useCallback((fields) => {
    setStep1Error("");
    setFormData((prev) => {
      const updated = { ...prev, ...fields };
      setCachedDraft(updated);
      return updated;
    });
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      await saveDraft(formData.applicationId, formData);
      showToast("Draft saved successfully.");
    } catch (e) {
      showToast("Draft saved locally.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Step 1 -> Step 2
  const handleNextFromStep1 = async () => {
    setStep1Error("");
    setIsSubmitting(true);
    try {
      const res = await saveStep1(formData);
      const savedData = res?.data || {};
      const updated = {
        ...formData,
        ...savedData,
        currentStep: 2,
      };
      handleUpdate(updated);
      setCachedDraft(updated);
      goToStep(2);
    } catch (err) {
      console.warn("Step 1 validation/save error:", err?.message || err);
      setStep1Error(err?.message || "Failed to save organisation information. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2 -> Step 3
  const handleNextFromStep2 = async (step2Payload) => {
    setIsSubmitting(true);
    try {
      const payload = {
        owner: step2Payload?.owner || formData.owner,
        ownerRole: step2Payload?.ownerRole || formData.ownerRole || "FOUNDER",
        otherRoleSpecification:
          step2Payload?.otherRoleSpecification ||
          formData.otherRoleSpecification ||
          "",
        isAuthorisedConfirmed:
          step2Payload?.isAuthorisedConfirmed ?? formData.isAuthorisedConfirmed ?? true,
        isAccountConnected: Boolean(step2Payload?.owner || formData.owner),
      };
      const appId = formData.applicationId;
      if (appId) {
        await saveStep2(appId, payload);
      }
      const updated = {
        ...formData,
        ...payload,
        currentStep: 3,
      };
      handleUpdate(updated);
      setCachedDraft(updated);
      goToStep(3);
    } catch (err) {
      console.warn("Step 2 navigation:", err);
      goToStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3 -> Step 4
  const handleNextFromStep3 = async (step3Payload) => {
    setIsSubmitting(true);
    try {
      const mergedFromPayload = {
        ...(step3Payload || {}),
      };

      const twitter =
        mergedFromPayload.xProfileUrl ||
        mergedFromPayload.socialLinks?.twitter ||
        mergedFromPayload.twitter ||
        "";
      const facebook =
        mergedFromPayload.facebookPageUrl ||
        mergedFromPayload.socialLinks?.facebook ||
        mergedFromPayload.facebook ||
        "";
      const instagram =
        mergedFromPayload.instagramProfileUrl ||
        mergedFromPayload.socialLinks?.instagram ||
        mergedFromPayload.instagram ||
        "";
      const youtube =
        mergedFromPayload.youtubeChannelUrl ||
        mergedFromPayload.socialLinks?.youtube ||
        mergedFromPayload.youtube ||
        "";

      const socialLinks = { twitter, facebook, instagram, youtube };

      const step3DataToSave = {
        legalOrgType: mergedFromPayload.legalOrgType || formData.legalOrgType,
        registeredOrgName: mergedFromPayload.registeredOrgName || formData.registeredOrgName,
        legalRegistrationNumber: mergedFromPayload.legalRegistrationNumber ?? formData.legalRegistrationNumber,
        registrationAuthority: mergedFromPayload.registrationAuthority ?? formData.registrationAuthority,
        dateOfRegistration: mergedFromPayload.dateOfRegistration ?? formData.dateOfRegistration,
        registeredOfficeCountryId: mergedFromPayload.registeredOfficeCountryId || formData.registeredOfficeCountryId,
        regulatoryReferenceId: mergedFromPayload.regulatoryReferenceId ?? formData.regulatoryReferenceId,
        industryGrievanceCouncil: mergedFromPayload.industryGrievanceCouncil ?? formData.industryGrievanceCouncil,
        xProfileUrl: twitter,
        twitter,
        facebookPageUrl: facebook,
        facebook,
        instagramProfileUrl: instagram,
        instagram,
        youtubeChannelUrl: youtube,
        youtube,
        socialLinks,
        ...(mergedFromPayload.documents ? { documents: mergedFromPayload.documents } : {}),
      };

      const appId = formData.applicationId;
      if (appId) {
        await saveStep3(appId, step3DataToSave);
      }

      const fullMerged = {
        ...formData,
        ...mergedFromPayload,
        ...step3DataToSave,
        currentStep: 4,
      };

      handleUpdate(fullMerged);
      setCachedDraft(fullMerged);
      goToStep(4);
    } catch (err) {
      console.warn("Step 3 navigation:", err);
      const fullMerged = {
        ...formData,
        ...(step3Payload || {}),
        currentStep: 4,
      };
      handleUpdate(fullMerged);
      setCachedDraft(fullMerged);
      goToStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-68px)] bg-surface-container-lowest selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b1b1b] text-white px-4 py-2.5 rounded-xl shadow-lg text-[13px] font-medium flex items-center gap-2 animate-fadeIn">
          <Icon name="check_circle" className="text-[18px] text-tertiary-fixed" />
          <span>{toastMessage}</span>
        </div>
      )}

      {currentStep === 1 && (
        <Step1OrganisationInfo
          data={formData}
          onChange={handleUpdate}
          onNext={handleNextFromStep1}
          onSaveDraft={handleSaveDraft}
          isSavingDraft={isSavingDraft}
          isSubmitting={isSubmitting}
          errorMessage={step1Error}
          onClearError={() => setStep1Error("")}
        />
      )}

      {currentStep === 2 && (
        <Step2FounderOwner
          data={formData}
          onChange={handleUpdate}
          onNext={handleNextFromStep2}
          onBack={() => goToStep(1)}
          onModifyStep1={() => goToStep(1)}
          onSaveDraft={handleSaveDraft}
          isSavingDraft={isSavingDraft}
          isSubmitting={isSubmitting}
        />
      )}

      {currentStep === 3 && (
        <Step3VerificationDocs
          data={formData}
          onChange={handleUpdate}
          onNext={handleNextFromStep3}
          onBack={() => goToStep(2)}
          onJumpToStep={(step) => goToStep(step)}
          onSaveDraft={handleSaveDraft}
          isSavingDraft={isSavingDraft}
          isSubmitting={isSubmitting}
        />
      )}

      {currentStep === 4 && (
        <Step4ReviewSubmit
          data={formData}
          onJumpToStep={(step) => goToStep(step)}
          onNext={() => goToStep(5)}
          onBack={() => goToStep(3)}
          onSaveDraft={handleSaveDraft}
          isSavingDraft={isSavingDraft}
        />
      )}

      {currentStep === 5 && (
        <Step5AccountCredentials
          data={formData}
          onChange={handleUpdate}
          onBack={() => goToStep(4)}
          onJumpToStep={(step) => goToStep(step)}
          onSaveDraft={handleSaveDraft}
          isSavingDraft={isSavingDraft}
        />
      )}
    </div>
  );
}
