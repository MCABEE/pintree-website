import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";


function Section6() {
  return (
    <div>
      <Navbar/>
      <div className="px-[24px]">
        
      <h1 className="text-[48px] sm:text-[96px] font-aeonik-medium text-[#1A1A1A] pb-[25px] text-left xl:text-center pt-[100px] md:pt-[180px]">
          Privacy Policy
        </h1>
        <p className="text-[24px] font-aeonik-regular text-left xl:text-center text-[#1A1A1A]">
          These terms govern your access to and use of Pintree’s services,{" "}
          <br /> features, content, and community tools.
        </p>
        <div className="text-[24px] text-[#000000] xl:px-[240px]">
          <p className="pt-[54px] ">Pintree – Privacy Policy</p>
          <p className="font-aeonik-bold pt-4">
            Last Updated: 2025 December 31
          </p>
          <p className="pt-4">
            Welcome to <span className="font-aeonik-bold">Pintree</span>{" "}
            (“Pintree”, “we”, “us”, or “our”). This Privacy Policy explains how
            we collect, use, store, and protect your personal information when
            you use the Pintree app, website, or any associated services that
            link to this Policy (collectively, the{" "}
            <span className="font-aeonik-bold">“Platform”</span> ).
          </p>
          <p className="pt-4">
            The Platform is owned and operated by{" "}
            <span className="font-aeonik-bold">MCABEE DIGITAL,</span> 715A,
            Spencer Plaza, Mount Road, Anna Salai, Chennai – 600002, India.
          </p>
          <p className="pt-4">
            If you have questions, contact us at{" "}
            <span className="font-aeonik-bold">contact@pintree.co.</span>
          </p>
          <h2 className="pt-8 font-aeonik-bold  ">1. Information We Collect</h2>
          <p className="pt-4">We collect three types of information:</p>

          <ul>
            <li>
              <strong>A) Information You Provide</strong>
            </li>
            <li>
              <strong>B) Information from Other Sources</strong>
            </li>
            <li>
              <strong>C) Automatically Collected Information</strong>
            </li>
          </ul>

          <div className="space-y-6">
            <h3 className=" font-aeonik-bold pt-4">
              A) Information You Provide
            </h3>

            <div className="space-y-4">
              <h4 className="font-aeonik-bold">
                1. Account &amp; Profile Data
              </h4>

              <p className="">
                When you register or update your profile, we collect information
                such as:
              </p>

              <ul className="list-disc pl-6 space-y-2 ">
                <li>Name (real name required)</li>
                <li>Mobile number</li>
                <li>Email address</li>
                <li>Gender</li>
                <li>Date of Birth / Age</li>
                <li>Nationality</li>
                <li>Native place (city, state, country)</li>
                <li>
                  Currently living location (city, country) — entered manually,
                  not detected automatically
                </li>
                <li>Education (school/college), job, employer — optional</li>
                <li>Interests, hobbies</li>
                <li>Profile photo and bio</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-aeonik-bold">2. User-Generated Content</h4>

              <p className="">
                We collect content you upload or create on the Platform:
              </p>

              <ul className="list-disc pl-6 space-y-2 ">
                <li>Photos</li>
                <li>Albums</li>
                <li>Text posts, blogs, polls, life events</li>
                <li>Comments and interactions</li>
              </ul>
              <p>
                Metadata such as upload time and device type may also be stored.
              </p>
            </div>
            <h4 className="font-aeonik-bold">3. Relationship Tool Data</h4>
            <p>
              When you use Pintree’s relationship features (when enabled), we
              may collect optional inputs such as interests or preferences to
              help find compatible connections. We do not ask for sensitive
              relationship status unless you voluntarily provide it.
            </p>
          </div>
          <div className="space-y-4 pt-4">
            <h4 className="font-aeonik-bold">4. Verification Information</h4>

            <p className="">
              For Pro accounts (creators, public figures, businesses,
              organizations, etc.), we may collect:
            </p>

            <ul className="list-disc pl-6 space-y-2 ">
              <li>Social media handles</li>
              <li>Business documents (e.g., GST for businesses)</li>
              <li>Public links for verification</li>
            </ul>
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="font-aeonik-bold">5. Messages</h4>

            <p className="">
              If messaging is available in your region, we collect:{" "}
            </p>

            <ul className="list-disc pl-6 space-y-2 ">
              <li>Metadata (time sent, sender/receiver, delivery status)</li>
            </ul>
            <p>
              Message content itself is private and encrypted. We do not read or
              access message content.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="font-aeonik-bold">
              6. Support &amp; Contact Information
            </h4>

            <p className="">
              When you contact us for support or feedback, we may receive the
              information you submit.
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">
              B) Information from Other Sources
            </h3>

            <p className="">We may receive:</p>

            <ul className="list-disc pl-6 space-y-2 ">
              <li>
                Information about you appearing in another user&apos;s content
                or comments
              </li>
              <li>
                Referral information if someone imports their contacts (if this
                feature is enabled)
              </li>
              <li>
                Public information from trusted sources for verification and
                safety
              </li>
            </ul>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">
              C) Automatically Collected Information
            </h3>

            <p className="font-aeonik-bold">1. Usage Information</p>
            <p>We collect data about how you interact with the Platform:</p>

            <ul className="list-disc pl-6 space-y-2 ">
              <li>Content you view or engage with</li>
              <li>Time spent on features</li>
              <li>Search activity</li>
              <li>Interaction with communities, rooms, and accounts</li>
            </ul>
            <p>This helps personalise content and ensure platform safety.</p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">
              2. Device &amp; Technical Information
            </h3>

            <p className="">We may collect:</p>

            <ul className="list-disc pl-6 space-y-2 ">
              <li>Device model &amp; OS</li>
              <li>App version</li>
              <li>IP address</li>
              <li>Network type</li>
              <li>Device identifiers</li>
              <li>Crash logs &amp; diagnostics</li>
            </ul>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">
              3. Cookies &amp; Similar Technologies
            </h3>

            <p className="">Cookies are used for:</p>

            <ul className="list-disc pl-6 space-y-2 ">
              <li>Login &amp; session management</li>
              <li>Analytics</li>
              <li>Personalisation</li>
            </ul>
            <p>
              You may disable cookies through your browser settings (some
              features may stop working).
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">2. How We Use Your Information</h3>

            <p className="">
              We use your information to operate, improve, protect, and
              personalise Pintree:
            </p>
            <h3 className="font-aeonik-bold">
              A) To Provide and Improve the Platform
            </h3>

            <ul className="list-disc pl-6 space-y-2 ">
              <li>Create and manage your account</li>
              <li>Deliver personalised content &amp; feeds</li>
              <li>Suggest communities, rooms, and connections</li>
              <li>
                Support internal operations (analytics, crash diagnostics,
                testing)
              </li>
            </ul>
            <p>
              You may disable cookies through your browser settings (some
              features may stop working).
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">B) Safety &amp; Moderation </h3>

            <ul className="list-disc pl-6 space-y-2 ">
              <li>
                Detect and prevent harmful content, fraud, spam, impersonation{" "}
              </li>
              <li>Review reports and enforce Community Guidelines </li>
              <li>Verify Pro accounts and businesses </li>
            </ul>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">C) Communication </h3>

            <ul className="list-disc pl-6 space-y-2 ">
              <li>
                Send important updates, service messages, and safety alerts{" "}
              </li>
              <li>Respond to your support requests </li>
            </ul>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">D) Pro Account Services </h3>
            <p>For creators, businesses, publishers, and organizations:</p>

            <ul className="list-disc pl-6 space-y-2 ">
              <li>Help reach relevant audiences</li>
              <li>Provide analytics and insights </li>
              <li>Enable verification and trust-building </li>
            </ul>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">
              E) Compliance &amp; Legal Obligations{" "}
            </h3>

            <ul className="list-disc pl-6 space-y-2 ">
              <li>Comply with Indian and international legal requirements</li>
              <li>Respond to valid law enforcement requests </li>
              <li>Prevent illegal or harmful activities </li>
            </ul>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">F) Future Payment Functions </h3>

            <p>
              If you use paid services (UPI, subscription, purchases) in the
              future, payment information will be processed securely by approved
              payment partners.
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">
              3. How We Share Your Information
            </h3>
            <p>
              We{" "}
              <span className="font-aeonik-bold">
                do not sell or rent your personal data
              </span>{" "}
              to any third parties.
            </p>
            <p>
              We only share information in the following limited situations:
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold"> A) Service Providers</h3>
            <p>We use trusted partners to operate the Platform:</p>

            <ul className="list-disc pl-6 space-y-2 ">
              <li>
                <span className="font-aeonik-bold"> AWS – </span>secure cloud
                storage, distribution
              </li>
              <li>
                <span className="font-aeonik-bold">Cloudflare –</span> data
                storage, distribution, security and performance
              </li>
              <li>
                <span className="font-aeonik-bold">Firebase – </span>
                authentication, notifications, analytics
              </li>
            </ul>
            <p>
              These providers access data strictly to perform services on our
              behalf.
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">
              B) Within the MCABEE DIGITAL Network
            </h3>

            <p>
              Some professional/business-related data may be used across our own
              products to improve service experience. We do not share data
              outside our company ecosystem.
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">C) Legal Requirements</h3>
            <p>
              We may share information with government/law-enforcement
              authorities if required to:
            </p>
            <ul className="list-disc pl-6 space-y-2 ">
              <li>Comply with law, court orders, or legal process</li>
              <li>
                Detect, prevent, or investigate fraud, threats, or violations
              </li>
              <li>
                Protect the rights, safety, or property of Pintree or users
              </li>
            </ul>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">D) Corporate Transactions</h3>
            <p>
              If Pintree undergoes a merger, acquisition, or asset transfer,
              your data may be included, following strict confidentiality
              protections.{" "}
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">E) With Your Consent</h3>
            <p>
              We may share information for other purposes if you explicitly
              consent.{" "}
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">4. Public Content</h3>
            <p>
              Content you choose to make{" "}
              <span className="font-aeonik-bold"> public </span> (posts,
              comments, profile fields, community activity) may be visible to:
            </p>
            <ul className="list-disc pl-6 space-y-2 ">
              <li>Other users</li>
              <li>Search engines</li>
              <li>External websites or aggregators</li>
            </ul>
            <p>You can adjust visibility anytime in Settings.</p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">5. Your Rights &amp; Choices</h3>
            <p>Depending on your country’s laws, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 ">
              <li>Access your data</li>
              <li>Correct or update profile information</li>
              <li>Delete your account anytime</li>
              <li>
                Download your profile data (Note: Photos cannot be
                mass-downloaded; text content can be copied following copyright
                rules)
              </li>
              <li>Control visibility settings</li>
              <li>Manage cookies</li>
            </ul>
            <p>We will verify your identity before fulfilling requests.</p>
            <p>
              To exercise rights, use the in-app settings or contact{" "}
              <span className="font-aeonik-bold">contact@pintree.co.</span>
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">6. Data Security &amp; Storage</h3>
            <p>We take reasonable measures to protect your data.</p>
            <p className="font-aeonik-bold">We use:</p>
            <ul className="list-disc pl-6 space-y-2 ">
              <li>Encryption</li>
              <li>Access controls</li>
              <li>Secure servers (AWS + Cloudflare)</li>
              <li>Monitoring and risk protections</li>
            </ul>
            <p>
              However, no online system is 100% secure. <br />
              We continuously improve our security to minimize risks.
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">7. Data Retention</h3>
            <p>We retain your information:</p>
            <ul className="list-disc pl-6 space-y-2 ">
              <li>As long as your account is active</li>
              <li>
                As required for safety, legal obligations, or dispute resolution
              </li>
              <li>For internal analytics and fraud prevention</li>
            </ul>
            <p>If you delete your account:</p>
            <ul className="list-disc pl-6 space-y-2 ">
              <li>Most personal data is permanently deleted</li>
              <li>Some logs may be retained for legal reasons</li>
              <li>
                Public posts shared by others may remain visible in reposted
                form (if applicable)
              </li>
            </ul>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">
              8. International Data Transfers
            </h3>
            <p>Your data may be stored or processed in:</p>
            <ul className="list-disc pl-6 space-y-2 ">
              <li>India</li>
              <li>Singapore</li>
              <li>United States</li>
            </ul>
            <p>
              We follow applicable data protection laws and ensure secure
              storage through global cloud providers.
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">9. Information for Minors</h3>
            <p>
              The Platform is for users{" "}
              <span className="font-aeonik-bold">13 years and above. </span>{" "}
              <br />
              If we discover a user below the allowed age, the account will be
              removed.{" "}
            </p>
            <p>
              If you believe a minor’s data was collected, contact{" "}
              <span className="font-aeonik-bold">contact@pintree.co.</span>{" "}
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <h3 className="font-aeonik-bold">10. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy occasionally. <br />
              If major changes are made, we will notify you through:
            </p>
            <ul className="list-disc pl-6 space-y-2 ">
              <li>App updates</li>
              <li>In-app alerts</li>
              <li>Revised “Last Updated” date</li>
            </ul>
            <p>We encourage you to review this page regularly.</p>
          </div>

          <div className="space-y-6 py-8">
            <h3 className="font-aeonik-bold">11. Contact Us</h3>
            <p>For questions or concerns, email:</p>
            <p className="font-aeonik-bold">�� contact@pintree.co</p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Section6;
