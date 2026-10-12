"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getValidAccessToken, authenticatedFetch, refreshAccessToken } from "@/utils/auth";

function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length >= 2) {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(decodeURIComponent(escape(atob(base64))));
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export default function AccountOverviewPage() {
  const router = useRouter();

  // Profile and community state
  const [profile, setProfile] = useState(null);
  const [createdCommunities, setCreatedCommunities] = useState({ total: 0, communities: [] });
  const [joinedCommunities, setJoinedCommunities] = useState({ total: 0, communities: [] });
  const [friendsData, setFriendsData] = useState({ total: 0, friends: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Authentication session state for dynamic verification badge and contact details
  const [sessionData, setSessionData] = useState({
    email: "",
    phone: "",
    loginMethod: null,
    isEmailVerified: false,
    isPhoneVerified: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("pintree_access_token");
    const storedLoginMethod = localStorage.getItem("pintree_login_method"); // "email" | "mobile"
    const storedLoginVerified = localStorage.getItem("pintree_login_verified") === "true";
    const storedUserEmail = localStorage.getItem("pintree_user_email") || "";
    const storedUserPhone = localStorage.getItem("pintree_user_phone") || "";
    const storedAuthEmail = localStorage.getItem("pintree_auth_email") || "";
    const storedAuthPhone = localStorage.getItem("pintree_auth_phone") || "";
    const storedEmailVerified = localStorage.getItem("pintree_email_verified");
    const storedMobileVerified = localStorage.getItem("pintree_mobile_verified");

    const jwtClaims = decodeJwt(token);

    // Initial values from session/token
    const initEmail = jwtClaims?.email || storedUserEmail || storedAuthEmail || "";
    const initPhone = jwtClaims?.mobileNumber || storedUserPhone || storedAuthPhone || "";

    // Verification evaluation according to login method and backend proof
    let initEmailVerified = false;
    let initPhoneVerified = false;

    if (storedLoginMethod === "email") {
      if (jwtClaims && typeof jwtClaims.isEmailVerified !== "undefined") {
        initEmailVerified = Boolean(jwtClaims.isEmailVerified);
      } else if (storedEmailVerified !== null && storedEmailVerified !== undefined) {
        initEmailVerified = storedEmailVerified === "true";
      } else {
        initEmailVerified = storedLoginVerified;
      }
    }

    if (storedLoginMethod === "mobile") {
      if (jwtClaims && typeof jwtClaims.isMobileVerified !== "undefined") {
        initPhoneVerified = Boolean(jwtClaims.isMobileVerified);
      } else if (storedMobileVerified !== null && storedMobileVerified !== undefined) {
        initPhoneVerified = storedMobileVerified === "true";
      } else {
        initPhoneVerified = storedLoginVerified;
      }
    }

    setSessionData({
      email: initEmail,
      phone: initPhone,
      loginMethod: storedLoginMethod || (jwtClaims?.loginMethod ?? null),
      isEmailVerified: initEmailVerified,
      isPhoneVerified: initPhoneVerified,
    });

    async function loadAccountData() {
      const activeToken = await getValidAccessToken();
      if (!activeToken) {
        setIsLoading(false);
        return;
      }

      try {
        const [profileRes, createdRes, joinedRes, friendsRes] = await Promise.allSettled([
          authenticatedFetch("https://dev.user.pintree.co/v1/users/profile"),
          authenticatedFetch("https://dev.user.pintree.co/v1/communities/created?page=1&limit=20&status=ALL"),
          authenticatedFetch("https://dev.user.pintree.co/v1/communities/joined?page=1&limit=20&status=ALL"),
          authenticatedFetch("https://dev.user.pintree.co/v1/connections/friends?page=1&limit=10"),
        ]);

        if (profileRes.status === "fulfilled" && profileRes.value.ok) {
          const profileJson = await profileRes.value.json();
          if (profileJson?.data) {
            const p = profileJson.data;
            setProfile(p);

            setSessionData((prev) => {
              const apiEmail = p.email;
              const apiPhone = p.mobileNumber || p.phoneNumber || p.phone;
              const apiLoginMethod = p.loginMethod || p.lastLoginMethod || prev.loginMethod;

              let isEmailVer = prev.isEmailVerified;
              if (typeof p.isEmailVerified !== "undefined") {
                isEmailVer = Boolean(p.isEmailVerified);
              } else if (typeof p.emailVerified !== "undefined") {
                isEmailVer = Boolean(p.emailVerified);
              }

              let isPhoneVer = prev.isPhoneVerified;
              if (typeof p.isMobileVerified !== "undefined") {
                isPhoneVer = Boolean(p.isMobileVerified);
              } else if (typeof p.phoneVerified !== "undefined") {
                isPhoneVer = Boolean(p.phoneVerified);
              } else if (typeof p.isPhoneVerified !== "undefined") {
                isPhoneVer = Boolean(p.isPhoneVerified);
              }

              return {
                email: apiEmail !== undefined && apiEmail !== null ? String(apiEmail) : prev.email,
                phone: apiPhone !== undefined && apiPhone !== null ? String(apiPhone) : prev.phone,
                loginMethod: apiLoginMethod,
                isEmailVerified: isEmailVer,
                isPhoneVerified: isPhoneVer,
              };
            });
          }
        }

        if (createdRes.status === "fulfilled" && createdRes.value.ok) {
          const createdJson = await createdRes.value.json();
          if (createdJson?.data) {
            setCreatedCommunities(createdJson.data);
          }
        }

        if (joinedRes.status === "fulfilled" && joinedRes.value.ok) {
          const joinedJson = await joinedRes.value.json();
          if (joinedJson?.data) {
            setJoinedCommunities(joinedJson.data);
          }
        }

        if (friendsRes.status === "fulfilled" && friendsRes.value.ok) {
          const friendsJson = await friendsRes.value.json();
          if (friendsJson?.data) {
            setFriendsData(friendsJson.data);
          }
        }
      } catch (err) {
        console.warn("Error loading account data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAccountData();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("pintree_access_token") : null;

    try {
      if (token) {
        await fetch("https://dev.user.pintree.co/v1/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }).catch(() => null);
      }
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("pintree_access_token");
        localStorage.removeItem("pintree_user_id");
        localStorage.removeItem("pintree_user_email");
        localStorage.removeItem("pintree_user_phone");
        localStorage.removeItem("pintree_auth_email");
        localStorage.removeItem("pintree_auth_phone");
        localStorage.removeItem("pintree_login_method");
        localStorage.removeItem("pintree_login_verified");
        localStorage.removeItem("pintree_email_verified");
        localStorage.removeItem("pintree_mobile_verified");
        document.cookie = "pintree_token=; path=/; max-age=0;";
      }
      router.push("/login");
    }
  };

  const fullName = profile?.fullName || "Amara Vance";
  const username = profile?.handleId
    ? `@${String(profile.handleId).trim().replace(/^@+/, "")}`
    : profile?.fullName
    ? `@${String(profile.fullName).toLowerCase().replace(/\s+/g, "").replace(/^@+/, "")}`
    : "@amaravance";

  // Display empty string if missing or undefined - never display placeholder text or fabricated data
  const emailDisplay = sessionData.email ? String(sessionData.email).trim() : "";
  const phoneDisplay = sessionData.phone ? String(sessionData.phone).trim() : "";

  // Dynamic Verified Badge Logic:
  // - Badge appears only next to the field used for login, provided that field is verified.
  // - Mobile login: verified badge beside phone number only.
  // - Email login: verified badge beside email address only.
  // - Do not display badge next to both fields simply because both values exist.
  // - If field value is empty or unverified, do not show badge.
  const showEmailBadge = sessionData.loginMethod === "email" && sessionData.isEmailVerified && Boolean(emailDisplay);
  const showPhoneBadge = sessionData.loginMethod === "mobile" && sessionData.isPhoneVerified && Boolean(phoneDisplay);

  const accountType = profile?.accountMode === "PUBLIC" ? "Personal" : profile?.accountMode || "Personal";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "October 2024";

  const friendsList = Array.isArray(friendsData?.friends)
    ? friendsData.friends
    : Array.isArray(friendsData?.data?.friends)
    ? friendsData.data.friends
    : [];

  const ownedCommunitiesList = Array.isArray(createdCommunities?.communities)
    ? createdCommunities.communities
    : Array.isArray(createdCommunities?.data?.communities)
    ? createdCommunities.data.communities
    : [];

  const joinedCommunitiesList = Array.isArray(joinedCommunities?.communities)
    ? joinedCommunities.communities
    : Array.isArray(joinedCommunities?.data?.communities)
    ? joinedCommunities.data.communities
    : [];

  const friendsCount = typeof friendsData?.total === "number"
    ? friendsData.total
    : typeof friendsData?.data?.total === "number"
    ? friendsData.data.total
    : profile?.friendsCount ?? 1285;

  const ownedCommunitiesCount = typeof createdCommunities?.total === "number"
    ? createdCommunities.total
    : typeof createdCommunities?.data?.total === "number"
    ? createdCommunities.data.total
    : 2;

  const joinedCommunitiesCount = typeof joinedCommunities?.total === "number"
    ? joinedCommunities.total
    : typeof joinedCommunities?.data?.total === "number"
    ? joinedCommunities.data.total
    : profile?.communitiesJoinedCount ?? 14;

  const avatarUrl = profile?.profileImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#fcf9f8] text-[#1b1c1c] font-jakarta antialiased flex flex-col justify-between selection:bg-[#bdf19a] selection:text-black">
      {/* MAIN CANVAS CONTAINER */}
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-0 py-8 md:py-10 flex flex-col justify-center">
        {/* PAGE INTRODUCTION */}
        <div className="mb-7">
          <h1 className="font-playfair text-[32px] md:text-[36px] text-[#1b1c1c] font-normal tracking-tight">
            Your Pintree Account
          </h1>
          <p className="text-[16px] leading-[24px] text-[#444748] mt-1.5 font-normal">
            Manage your account and personal details.
          </p>
        </div>

        {/* BALANCED TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Profile Information Panel (7 cols) */}
          <section className="lg:col-span-7 bg-white border border-[#e4e2e1] rounded-xl p-6 md:p-8 shadow-[0_8px_30px_-4px_rgba(19,19,19,0.03)] flex flex-col justify-between">
            <div>
              {/* Profile Card Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#e4e2e1]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-[#e4e2e1] flex-shrink-0 bg-[#f6f3f2]">
                    <img
                      alt={`${fullName} portrait`}
                      className="w-full h-full object-cover"
                      src={avatarUrl}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h2 className="text-[15px] leading-[20px] font-bold text-[#1b1c1c] capitalize">
                        {fullName}
                      </h2>
                      {/* Curated pill badge */}
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#f6f3f2] text-[#444748] border border-[#e4e2e1]">
                        {accountType} Account
                      </span>
                    </div>
                    <span className="text-[14px] leading-[20px] text-[#747878] mt-0.5">
                      {username}
                    </span>
                  </div>
                </div>

                {/* Edit Profile Action Button */}
                <button
                  type="button"
                  className="h-9 px-4 rounded-full border border-[#e4e2e1] bg-white text-[13px] leading-[18px] text-[#1b1c1c] font-medium hover:bg-[#f6f3f2] hover:border-[#c4c7c7] transition-colors flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#1b1c1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Edit profile</span>
                </button>
              </div>

              {/* Structured Information Rows */}
              <div className="divide-y divide-[#e4e2e1]">
                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[13px] leading-[18px] text-[#747878] font-semibold">Full name</span>
                  <span className="text-[16px] leading-[24px] text-[#1b1c1c] font-medium capitalize">
                    {fullName}
                  </span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[13px] leading-[18px] text-[#747878] font-semibold">Username</span>
                  <span className="text-[16px] leading-[24px] text-[#1b1c1c] font-medium">
                    {username}
                  </span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[13px] leading-[18px] text-[#747878] font-semibold">Email address</span>
                  <div className="flex items-center gap-2">
                    <span suppressHydrationWarning className="text-[16px] leading-[24px] text-[#1b1c1c] font-medium">
                      {emailDisplay}
                    </span>
                    {showEmailBadge && (
                      <span className="inline-flex items-center text-[11px] font-semibold text-[#3d6922] gap-1 bg-[#baee97]/30 px-2 py-0.5 rounded-full border border-[#baee97]">
                        <svg className="w-3.5 h-3.5 text-[#3d6922]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[13px] leading-[18px] text-[#747878] font-semibold">Phone number</span>
                  <div className="flex items-center gap-2">
                    <span suppressHydrationWarning className="text-[16px] leading-[24px] text-[#1b1c1c] font-medium">
                      {phoneDisplay}
                    </span>
                    {showPhoneBadge && (
                      <span className="inline-flex items-center text-[11px] font-semibold text-[#3d6922] gap-1 bg-[#baee97]/30 px-2 py-0.5 rounded-full border border-[#baee97]">
                        <svg className="w-3.5 h-3.5 text-[#3d6922]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[13px] leading-[18px] text-[#747878] font-semibold">Account type</span>
                  <span suppressHydrationWarning className="text-[16px] leading-[24px] text-[#1b1c1c] font-medium">
                    {accountType}
                  </span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[13px] leading-[18px] text-[#747878] font-semibold">Friends</span>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center -space-x-2">
                      {friendsList.length > 0 ? (
                        friendsList.slice(0, 4).map((friend, idx) => {
                          const imgUrl = friend?.profileImageUrl || friend?.user?.profileImageUrl || friend?.avatarUrl;
                          return imgUrl ? (
                            <img
                              key={friend.id || friend.userId || idx}
                              className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                              src={imgUrl}
                              alt={friend.fullName || friend.name || `Friend ${idx + 1}`}
                            />
                          ) : (
                            <div
                              key={friend.id || friend.userId || idx}
                              className="w-6 h-6 rounded-full bg-[#e4e2e1] text-[#1b1c1c] text-[10px] font-bold flex items-center justify-center ring-2 ring-white uppercase"
                            >
                              {(friend.fullName || friend.name || "F")[0]}
                            </div>
                          );
                        })
                      ) : (
                        <>
                          <img className="w-6 h-6 rounded-full object-cover ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Friend 1" />
                          <img className="w-6 h-6 rounded-full object-cover ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Friend 2" />
                          <img className="w-6 h-6 rounded-full object-cover ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Friend 3" />
                          <img className="w-6 h-6 rounded-full object-cover ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Friend 4" />
                        </>
                      )}
                    </div>
                    <span suppressHydrationWarning className="text-[16px] leading-[24px] text-[#1b1c1c] font-medium">
                      {friendsCount.toLocaleString()} Friends
                    </span>
                  </div>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[13px] leading-[18px] text-[#747878] font-semibold">Owned communities</span>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center -space-x-2">
                      {ownedCommunitiesList.length > 0 ? (
                        ownedCommunitiesList.slice(0, 4).map((community, idx) => {
                          const imgUrl = community?.profileImageUrl || community?.coverImageUrl || community?.iconUrl || community?.avatarUrl;
                          return imgUrl ? (
                            <img
                              key={community.id || idx}
                              className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                              src={imgUrl}
                              alt={community.name || `Community ${idx + 1}`}
                            />
                          ) : (
                            <div
                              key={community.id || idx}
                              className="w-6 h-6 rounded-full bg-[#baee97] text-[#3d6922] text-[10px] font-bold flex items-center justify-center ring-2 ring-white uppercase"
                            >
                              {(community.name || "C")[0]}
                            </div>
                          );
                        })
                      ) : (
                        <>
                          <img className="w-6 h-6 rounded-full object-cover ring-2 ring-white" src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80" alt="Community 1" />
                          <img className="w-6 h-6 rounded-full object-cover ring-2 ring-white" src="https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=100&auto=format&fit=crop&q=80" alt="Community 2" />
                        </>
                      )}
                    </div>
                    <span suppressHydrationWarning className="text-[16px] leading-[24px] text-[#1b1c1c] font-medium">
                      Owned {ownedCommunitiesCount} {ownedCommunitiesCount === 1 ? "community" : "communities"}
                    </span>
                  </div>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[13px] leading-[18px] text-[#747878] font-semibold">Joined communities</span>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center -space-x-2">
                      {joinedCommunitiesList.length > 0 ? (
                        joinedCommunitiesList.slice(0, 5).map((community, idx) => {
                          const imgUrl = community?.profileImageUrl || community?.coverImageUrl || community?.iconUrl || community?.avatarUrl;
                          return imgUrl ? (
                            <img
                              key={community.id || idx}
                              className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                              src={imgUrl}
                              alt={community.name || `Community ${idx + 1}`}
                            />
                          ) : (
                            <div
                              key={community.id || idx}
                              className="w-6 h-6 rounded-full bg-[#CAFFA6] text-[#1b1c1c] text-[10px] font-bold flex items-center justify-center ring-2 ring-white uppercase"
                            >
                              {(community.name || "C")[0]}
                            </div>
                          );
                        })
                      ) : (
                        <>
                          <img className="w-6 h-6 rounded-full object-cover ring-2 ring-white" src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100&auto=format&fit=crop&q=80" alt="Community 3" />
                          <img className="w-6 h-6 rounded-full object-cover ring-2 ring-white" src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=100&auto=format&fit=crop&q=80" alt="Community 4" />
                          <img className="w-6 h-6 rounded-full object-cover ring-2 ring-white" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&auto=format&fit=crop&q=80" alt="Community 5" />
                        </>
                      )}
                    </div>
                    <span suppressHydrationWarning className="text-[16px] leading-[24px] text-[#1b1c1c] font-medium">
                      {joinedCommunitiesCount} communities
                    </span>
                  </div>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <span className="text-[13px] leading-[18px] text-[#747878] font-semibold">Member since</span>
                  <span suppressHydrationWarning className="text-[16px] leading-[24px] text-[#1b1c1c] font-medium">
                    {memberSince}
                  </span>
                </div>
              </div>
            </div>

            {/* Discreet micro-copy at bottom of panel */}
            <div className="mt-6 pt-4 border-t border-[#e4e2e1] flex items-center justify-between text-[#444748] text-[11px] font-semibold">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#747878]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Information visible according to your privacy settings
              </span>
              <span className="text-[#747878] font-medium">
                Manage visibility
              </span>
            </div>
          </section>

          {/* RIGHT COLUMN: Mobile Promotion & Account Actions (5 cols) */}
          <section className="lg:col-span-5 flex flex-col gap-5">
            {/* Mobile App Promotion Card */}
            <div className="bg-[#f6f3f2] border border-[#e4e2e1] rounded-xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#CAFFA6]"></span>
                  <span className="text-[11px] font-semibold tracking-wider text-[#747878] uppercase">
                    Mobile Experience
                  </span>
                </div>
                <h3 className="font-playfair text-[22px] leading-[30px] text-[#1b1c1c] font-medium">
                  Experience more with Pintree
                </h3>
                <p className="text-[14px] leading-[20px] text-[#444748] mt-2 leading-relaxed">
                  Get the full Pintree experience on our mobile app
                </p>
                <div className="mt-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link
                      className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-black text-white text-[15px] leading-[20px] font-medium hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-sm"
                      href="/#download"
                    >
                      <span>Explore the Pintree app</span>
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              {/* Decorative clean ambient element */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#e4e2e1] opacity-50 blur-xl pointer-events-none"></div>
            </div>

            {/* Account Actions & Support List */}
            <div className="bg-white border border-[#e4e2e1] rounded-xl p-6 shadow-[0_8px_30px_-4px_rgba(19,19,19,0.03)]">
              <h3 className="text-[15px] leading-[20px] font-bold text-[#1b1c1c] mb-4">
                Account Actions &amp; Support
              </h3>
              <div className="divide-y divide-[#e4e2e1]">
                {/* Row 1: Help & Support */}
                <div className="py-3.5 flex items-center justify-between -mx-3 px-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#747878] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex flex-col text-left">
                      <span className="text-[13px] leading-[18px] font-semibold text-[#1b1c1c]">
                        Help &amp; Support
                      </span>
                      <span className="text-[14px] leading-[20px] text-[#444748]">
                        Get help with account access, login or other issues.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Privacy & Security */}
                <div className="py-3.5 flex items-center justify-between -mx-3 px-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#747878] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div className="flex flex-col text-left">
                      <span className="text-[13px] leading-[18px] font-semibold text-[#1b1c1c]">
                        Privacy &amp; Security
                      </span>
                      <span className="text-[14px] leading-[20px] text-[#444748]">
                        Learn how Pintree handles and protects your information.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 3: Terms of Service */}
                <div className="py-3.5 flex items-center justify-between -mx-3 px-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#747878] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="flex flex-col text-left">
                      <span className="text-[13px] leading-[18px] font-semibold text-[#1b1c1c]">
                        Terms of Service
                      </span>
                      <span className="text-[14px] leading-[20px] text-[#444748]">
                        Read our terms, conditions, and usage policies.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 4: Log out */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full py-3.5 flex items-center justify-between group hover:bg-[#f6f3f2] -mx-3 px-3 rounded-lg transition-colors text-left cursor-pointer disabled:opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#747878]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-[13px] leading-[18px] font-semibold text-[#1b1c1c]">
                      {isLoggingOut ? "Logging out..." : "Log out"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#CAFFA6]"></span>
                    <span className="text-[11px] font-semibold text-[#747878]">Session active</span>
                  </div>
                </button>

                {/* Row 5: Delete account */}
                <Link
                  href="/account/delete"
                  className="w-full py-3.5 flex items-start justify-between group hover:bg-[#f6f3f2] -mx-3 px-3 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#ba1a1a] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-[13px] leading-[18px] font-semibold text-[#ba1a1a]">
                        Delete account
                      </span>
                      <span className="text-[14px] leading-[20px] text-[#444748]">
                        Permanently request deletion of your Pintree account and associated data.
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="z-30 w-full shrink-0 border-t border-neutral-100 bg-white py-4 mt-8">
        <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-3 px-6 text-center text-xs text-neutral-400 font-jakarta">
          <span>© Pintree</span>
          <span className="text-neutral-300">·</span>
          <Link
            className="transition-colors hover:text-neutral-700"
            href="/terms-of-service"
          >
            Terms of use
          </Link>
          <span className="text-neutral-300">·</span>
          <Link
            className="transition-colors hover:text-neutral-700"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
          <span className="text-neutral-300">·</span>
          <Link
            className="transition-colors hover:text-neutral-700"
            href="/community-guidlines"
          >
            Community Guidelines
          </Link>
          <span className="text-neutral-300">·</span>
          <Link
            className="transition-colors hover:text-neutral-700"
            href="/contact"
          >
            Report a problem
          </Link>
        </div>
      </footer>
    </div>
  );
}
