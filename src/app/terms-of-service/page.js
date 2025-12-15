// import Navbar from "@/components/Navbar";
// import React from "react";

// const page = () => {
//   return (
//     <div>
//       <Navbar />
//       <h1 className="text-[96px] font-aeonik-medium text-[#1A1A1A] pb-[25px] text-center pt-[180px]">
//         Terms of Service
//       </h1>
//       <p className="text-[24px] font-aeonik-regular text-center text-[#1A1A1A]">
//         Guidelines that define your rights, responsibilities, and safe usage of
//         <br /> Pintree’s platform and community features.
//       </p>
//       <div className="text-[24px] text-[#000000] font-aeonik-regular px-[240px]">
//         <p className="pt-[54px] ">Pintree – Terms of Use</p>
//         <p className=" font-aeonik-semibold pt-4">
//           Last updated: [31 December 2025]
//         </p>
//         <p className="pt-8 ">
//           These Terms of Use <span className="font-aeonik-bold">(“Terms”)</span>{" "}
//           govern your access to and use of Pintree and any related websites,
//           apps, tools and services (collectively, the “Platform” or “Services”).
//         </p>
//         <p className="pt-4">
//           The Platform is owned and operated by{" "}
//           <span className="font-aeonik-bold">MCABEE DIGITAL</span>, an Indian
//           company{" "}
//           <span className="font-aeonik-bold">
//             (“MCABEE DIGITAL”, “Pintree”, “we”, “us”, “our”).
//           </span>
//         </p>
//         <p>
//           By creating an account or using Pintree, you agree to these Terms.
//         </p>
//         <p className="pt-8 font-aeonik-medium">1. Your Relationship with Us</p>
//         <p className="pt-8 font-aeonik-medium">1.1 What is Pintree?</p>
//         <p className="pt-4">
//           Pintree is a community-based social platform where users can share and
//           discover content such as:
//         </p>
//         <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
//           <li>Photos and multi-photo albums</li>
//           <li>Text posts and blogs</li>
//           <li>Life events and updates</li>
//           <li>Polls and similar interactive posts</li>
//           <li>Comments, reactions and community discussions</li>
//         </ul>
//         <p className="pt-4">
//           We <span className="font-aeonik-medium">do not</span> currently
//           support video or music uploads or streaming.
//         </p>
//         <p className="pt-8 font-aeonik-medium">1.2 Personal vs. Pro use</p>
//         <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
//           <li>
//             {" "}
//             Our Services are{" "}
//             <span className="font-aeonik-medium">
//               {" "}
//               primarily meant for personal, non-commercial use.
//             </span>
//           </li>
//           <li>
//             {" "}
//             Limited commercial and promotional use is allowed{" "}
//             <span className="font-aeonik-medium">
//               only through authorized Pro Accounts,
//             </span>{" "}
//             such as creators, businesses, media, and institutions, and must
//             always comply with these Terms and applicable laws.
//           </li>
//         </ul>
//         <p className="pt-8 font-aeonik-medium">1.3 Binding agreement</p>
//         <p className="pt-2">
//           These Terms form a legally binding agreement between you and MCABEE
//           DIGITAL. If you do not agree with any part of these Terms,{" "}
//           <span className="font-aeonik-medium">do not use Pintree.</span>
//         </p>
//         <p className="pt-8 font-aeonik-medium">
//           2. Eligibility and Age Requirements
//         </p>
//         <p className="pt-8 font-aeonik-medium">2.1 Minimum age</p>
//         <p className="pt-2">You may use Pintree only if:</p>
//         <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
//           <li>
//             You are at least{" "}
//             <span className="font-aeonik-medium">13 years old,</span> and
//           </li>
//           <li>
//             {" "}
//             You are capable of forming a binding contract under applicable law,
//             or you have the consent of a parent or legal guardian (if required
//             in your country).
//           </li>
//         </ul>
//         <p className="pt-8 font-aeonik-medium">2.2 Indian origin focus</p>
//         <p className="pt-4">
//           Pintree is currently designed for{" "}
//           <span className="font-aeonik-medium">
//             Indian origin users globally,
//           </span>{" "}
//           and is operated from India. However, anyone who complies with these
//           Terms and applicable local laws may use the Platform.
//         </p>
//         <p className="pt-8 font-aeonik-medium">2.3 If you are under 18</p>
//         <p className="pt-4">
//           If you are under 18, you confirm that you have obtained permission
//           from your parent or legal guardian to use the Services. We may ask for
//           additional verification where required by law.
//         </p>
//         <p className="pt-8 font-aeonik-medium">
//           3. Real Identity and Account Registration
//         </p>
//         <p className="pt-8 font-aeonik-medium">3.1 Real identity requirement</p>
//         <p className="pt-2">
//           Pintree is a real-identity platform. When you create an account, you
//           must:
//         </p>
//         <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
//           <li>
//             {" "}
//             Provide your{" "}
//             <span className="font-aeonik-medium">real full name, </span>matching
//             your ID or commonly used legal name
//           </li>
//           <li>
//             Provide a{" "}
//             <span className="font-aeonik-medium">
//               valid and accessible email address or mobile number
//             </span>
//           </li>
//           <li>Verify your email or phone number when requested</li>
//         </ul>
//         <p className="pt-4">
//           Your username/handle can be different (creative or brand-style), but
//           your account profile details must be truthful and not misleading.
//         </p>
//         <p className="pt-8 font-aeonik-medium">3.2 Account security</p>
//         <p className="pt-2">You are responsible for:</p>
//         <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
//           <li> Keeping your login credentials confidential</li>{" "}
//           <li>Restricting access to your device and account</li>
//           <li>All activity that occurs under your account</li>
//         </ul>
//         <p className="pt-4">
//           If you suspect unauthorized access, you should immediately change your
//           password and follow the in-app help or contact{" "}
//           <span className="font-aeonik-medium">contact@pintree.co </span> for
//           support.
//         </p>{" "}
//         <p className="pt-8 font-aeonik-medium">3.3 One person, one identity </p>
//         <p className="pt-4">
//           You agree <span className="font-aeonik-medium">not</span> to:
//         </p>
//         <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
//           <li>
//             {" "}
//             Impersonate another person, brand, organization, or public authority
//           </li>
//           <li>
//             {" "}
//             Create accounts on behalf of others without proper authorization{" "}
//           </li>
//           <li> Misrepresent your identity, role, or affiliation</li>
//         </ul>
//         <h1 className="pt-8 font-aeonik-medium">4. Types of Accounts</h1>
//         <p className="pt-8 font-aeonik-medium">4.1 Personal Accounts</p>
//         <p className="pt-4">Personal accounts are for individual users to:</p>
//         <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
//           <li>Connect with communities and rooms</li>{" "}
//           <li> Share personal photos, posts, blogs, life events, and polls</li>{" "}
//           <li>Interact through comments, reactions, and discussions</li>
//         </ul>
//         <p className="pt-4">
//           Personal accounts are not intended for structured commercial
//           advertising or large-scale brand promotion.
//         </p>
//         <p className="pt-8 font-aeonik-medium"> 4.2 Pro Accounts</p>
//         <p className="pt-4">
//           Pro Accounts are intended for professional and organizational
//           presence, discovery, promotion, and communications. Pro Accounts may
//           include:
//         </p>
//         <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
//           <li>Creators and Influencers</li>
//           <li>Public Figures and Celebrities</li>
//           <li>
//             Communities (e.g., fan communities, interest groups, official clubs)
//           </li>
//           <li>Businesses and Brands</li>
//           <li>News Publishers (Print, visual, online, audio, etc.)</li>
//           <li>Educational and Religious Entities</li>
//           <li>Government, NGOs, and Non-profits</li>
//           <li>
//             Infotainment Channels (Print, video, online, etc., even if they
//             currently link outside Pintree for video)
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default page;

import Navbar from "@/components/Navbar";
import React from "react";

const page = () => {
  return (
    <div>
      <Navbar />
      <h1 className="text-[96px] font-aeonik-medium text-[#1A1A1A] pb-[25px] text-center pt-[180px]">
        Terms of Service
      </h1>
      <p className="text-[24px] font-aeonik-regular text-center text-[#1A1A1A]">
        Guidelines that define your rights, responsibilities, and safe usage of
        <br /> Pintree’s platform and community features.
      </p>
      <div className="text-[24px] text-[#000000] font-aeonik-regular px-[240px]">
        <p className="pt-[54px] ">Pintree – Terms of Use</p>
        <p className=" font-aeonik-semibold pt-4">
          Last updated: [31 December 2025]
        </p>
        <p className="pt-8 ">
          These Terms of Use <span className="font-aeonik-bold">(“Terms”)</span>{" "}
          govern your access to and use of Pintree and any related websites,
          apps, tools and services (collectively, the “Platform” or “Services”).
        </p>
        <p className="pt-4">
          The Platform is owned and operated by{" "}
          <span className="font-aeonik-bold">MCABEE DIGITAL</span>, an Indian
          company{" "}
          <span className="font-aeonik-bold">
            (“MCABEE DIGITAL”, “Pintree”, “we”, “us”, “our”).
          </span>
        </p>
        <p>
          By creating an account or using Pintree, you agree to these Terms.
        </p>
        <p className="pt-8 font-aeonik-medium">1. Your Relationship with Us</p>
        <p className="pt-8 font-aeonik-medium">1.1 What is Pintree?</p>
        <p className="pt-4">
          Pintree is a community-based social platform where users can share and
          discover content such as:
        </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>Photos and multi-photo albums</li>
          <li>Text posts and blogs</li>
          <li>Life events and updates</li>
          <li>Polls and similar interactive posts</li>
          <li>Comments, reactions and community discussions</li>
        </ul>
        <p className="pt-4">
          We <span className="font-aeonik-medium">do not</span> currently
          support video or music uploads or streaming.
        </p>
        <p className="pt-8 font-aeonik-medium">1.2 Personal vs. Pro use</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            {" "}
            Our Services are{" "}
            <span className="font-aeonik-medium">
              {" "}
              primarily meant for personal, non-commercial use.
            </span>
          </li>
          <li>
            {" "}
            Limited commercial and promotional use is allowed{" "}
            <span className="font-aeonik-medium">
              only through authorized Pro Accounts,
            </span>{" "}
            such as creators, businesses, media, and institutions, and must
            always comply with these Terms and applicable laws.
          </li>
        </ul>
        <p className="pt-8 font-aeonik-medium">1.3 Binding agreement</p>
        <p className="pt-2">
          These Terms form a legally binding agreement between you and MCABEE
          DIGITAL. If you do not agree with any part of these Terms,{" "}
          <span className="font-aeonik-medium">do not use Pintree.</span>
        </p>
        <p className="pt-8 font-aeonik-medium">
          2. Eligibility and Age Requirements
        </p>
        <p className="pt-8 font-aeonik-medium">2.1 Minimum age</p>
        <p className="pt-2">You may use Pintree only if:</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            You are at least{" "}
            <span className="font-aeonik-medium">13 years old,</span> and
          </li>
          <li>
            {" "}
            You are capable of forming a binding contract under applicable law,
            or you have the consent of a parent or legal guardian (if required
            in your country).
          </li>
        </ul>
        <p className="pt-8 font-aeonik-medium">2.2 Indian origin focus</p>
        <p className="pt-4">
          Pintree is currently designed for{" "}
          <span className="font-aeonik-medium">
            Indian origin users globally,
          </span>{" "}
          and is operated from India. However, anyone who complies with these
          Terms and applicable local laws may use the Platform.
        </p>
        <p className="pt-8 font-aeonik-medium">2.3 If you are under 18</p>
        <p className="pt-4">
          If you are under 18, you confirm that you have obtained permission
          from your parent or legal guardian to use the Services. We may ask for
          additional verification where required by law.
        </p>
        <p className="pt-8 font-aeonik-medium">
          3. Real Identity and Account Registration
        </p>
        <p className="pt-8 font-aeonik-medium">3.1 Real identity requirement</p>
        <p className="pt-2">
          Pintree is a real-identity platform. When you create an account, you
          must:
        </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            {" "}
            Provide your{" "}
            <span className="font-aeonik-medium">real full name, </span>matching
            your ID or commonly used legal name
          </li>
          <li>
            Provide a{" "}
            <span className="font-aeonik-medium">
              valid and accessible email address or mobile number
            </span>
          </li>
          <li>Verify your email or phone number when requested</li>
        </ul>
        <p className="pt-4">
          Your username/handle can be different (creative or brand-style), but
          your account profile details must be truthful and not misleading.
        </p>
        <p className="pt-8 font-aeonik-medium">3.2 Account security</p>
        <p className="pt-2">You are responsible for:</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li> Keeping your login credentials confidential</li>{" "}
          <li>Restricting access to your device and account</li>
          <li>All activity that occurs under your account</li>
        </ul>
        <p className="pt-4">
          If you suspect unauthorized access, you should immediately change your
          password and follow the in-app help or contact{" "}
          <span className="font-aeonik-medium">contact@pintree.co </span> for
          support.
        </p>{" "}
        <p className="pt-8 font-aeonik-medium">3.3 One person, one identity </p>
        <p className="pt-4">
          You agree <span className="font-aeonik-medium">not</span> to:
        </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            {" "}
            Impersonate another person, brand, organization, or public authority
          </li>
          <li>
            {" "}
            Create accounts on behalf of others without proper authorization{" "}
          </li>
          <li> Misrepresent your identity, role, or affiliation</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">4. Types of Accounts</h1>
        <p className="pt-8 font-aeonik-medium">4.1 Personal Accounts</p>
        <p className="pt-4">Personal accounts are for individual users to:</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>Connect with communities and rooms</li>{" "}
          <li> Share personal photos, posts, blogs, life events, and polls</li>{" "}
          <li>Interact through comments, reactions, and discussions</li>
        </ul>
        <p className="pt-4">
          Personal accounts are not intended for structured commercial
          advertising or large-scale brand promotion.
        </p>
        <p className="pt-8 font-aeonik-medium"> 4.2 Pro Accounts</p>
        <p className="pt-4">
          Pro Accounts are intended for professional and organizational
          presence, discovery, promotion, and communications. Pro Accounts may
          include:
        </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li className="font-aeonik-bold">Creators and Influencers</li>
          <li className="font-aeonik-bold">Public Figures and Celebrities</li>
          <li>
            <span className="font-aeonik-bold"> Communities</span> (e.g., fan
            communities, interest groups, official clubs)
          </li>
          <li className="font-aeonik-bold">Businesses and Brands</li>
          <li>
            {" "}
            <span className="font-aeonik-bold">News Publishers</span> (Print,
            visual, online, audio, etc.)
          </li>
          <li className="font-aeonik-bold">
            Educational and Religious Entities
          </li>
          <li className="font-aeonik-bold">
            Government, NGOs, and Non-profits
          </li>
          <li>
            <span className="font-aeonik-bold">Infotainment Channels</span>{" "}
            (Print, video, online, etc., even if they currently link outside
            Pintree for video)
          </li>
        </ul>
        <p>Pro Accounts must:</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li className="font-aeonik-bold">
            Provide accurate verification details as requested
          </li>
          <li className="font-aeonik-bold">
            Use Pintree only in accordance with applicable laws (including
            advertising,
            <br />
            consumer, and data protection laws)
          </li>
          <li className="font-aeonik-bold">
            Not mislead users about services, pricing, or affiliations
          </li>
        </ul>
        <p className="pt-8 font-aeonik-medium">
          4.3 Revenue, Ads and Paid Services
        </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            <span className="font-aeonik-bold">
              No subscriptions currently:
            </span>{" "}
            Pintree does not currently offer paid subscriptions or in-app
            purchases.
          </li>

          <li>
            <span className="font-aeonik-bold">No revenue sharing yet:</span>{" "}
            Creators do not currently earn revenue directly from Pintree (e.g.,
            no ad revenue sharing or creator fund at this time).
          </li>

          <li>
            <span className="font-aeonik-bold">
              No platform ad products yet:
            </span>{" "}
            Pintree does not currently provide paid ad products or sponsored
            posts through an ad system.
          </li>
        </ul>
        <p className="pt-4">
          If we introduce any paid features, ad products, or revenue sharing in
          the future, they may be governed by additional or updated terms.
        </p>
        <p className="pt-8 font-aeonik-medium">
          5. Accessing and Using Our Services
        </p>
        <p className="pt-8 font-aeonik-bold">5.1 License to use Pintree</p>
        <p className="pt-4">
          Subject to these Terms, we give you a limited, non-exclusive,
          non-transferable, revocable license to use the Platform for:
        </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>Personal purposes (for personal accounts), and</li>
          <li>
            Authorized promotional / organizational purposes (for Pro Accounts).
          </li>
        </ul>
        <p className="pt-4">
          We can modify, suspend, or terminate this license at any time in
          accordance with these Terms.
        </p>
        <p className="pt-8 font-aeonik-medium">5.2 Things you must NOT do</p>
        <p className="pt-4">You agree that you will not:</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            Use Pintree for any illegal purpose or in violation of any law or
            regulation
          </li>
          <li>
            Infringe the rights (including privacy and intellectual property) of
            others
          </li>
          <li>Harass, abuse, threaten, defame, or bully others</li>
          <li>
            {" "}
            Upload or share content that is hateful, obscene, pornographic,
            extremely violent, or promotes self-harm, terrorism, or organized
            crime
          </li>
          <li>
            {" "}
            Upload or share private or sensitive information of others (e.g.,
            personal IDs, addresses, phone numbers, financial details) without
            consent
          </li>
          <li>
            {" "}
            Post misleading, fraudulent, or deceptive content (including scams
            and fake offers)
          </li>
          <li>
            {" "}
            Spread spam, chain letters, pyramid schemes, or unsolicited bulk
            messages
          </li>
          <li>
            {" "}
            Attempt to reverse engineer, decompile, or otherwise access the
            source code of the app or related systems
          </li>
          <li>
            {" "}
            Use bots, scripts, or automated tools to scrape, crawl, or collect
            data from Pintree (except as allowed by applicable law and our prior
            written consent)
          </li>
          <li>
            Interfere with the security or proper working of the Platform (e.g.,
            hacking, probing, overloading, attacking servers)
          </li>
        </ul>
        <p className="pt-4">
          In addition to the above, you must comply with our Community
          Guidelines at all times (which will be read together with these
          Terms).
        </p>
        <h1 className="pt-8 font-aeonik-medium">
          6. Content You Share (User-Generated Content)
        </h1>
        <p className="pt-8 font-aeonik-bold">6.1 Types of content we support</p>
        <p className="pt-4">On Pintree, you may share (“User Content”):</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>Photos, images, and multi-photo albums</li>
          <li> Text posts, blogs, and long-form articles</li>
          <li>Life events and personal updates</li>
          <li> Polls and other simple interactive posts</li>
          <li> Comments, replies, and reactions</li>
          <li> Profile and community information</li>
        </ul>
        <p className="pt-4">
          We do not currently allow uploading or streaming of videos or
          music/audio tracks as content.
        </p>
        <p className="pt-8 font-aeonik-bold">
          6.2 Your responsibility for your content
        </p>
        <p className="pt-4">
          You are solely responsible for the content you post. You confirm that:
        </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            {" "}
            You own the content you share, or you have the necessary rights and
            permissions to share it;
          </li>
          <li>
            {" "}
            Your content does not infringe any third-party rights (copyright,
            trademarks, privacy, publicity, etc.);
          </li>
          <li>
            {" "}
            Your content complies with these Terms and our Community Guidelines.
          </li>
        </ul>
        <p className="pt-4">
          If someone claims that your content violates their rights, you may be
          legally responsible for that content.
        </p>
        <p className="pt-8 font-aeonik-bold">
          6.3 License you grant to Pintree
        </p>
        <p className="pt-4">
          You (or your licensors) retain ownership of your User Content.
          However, by posting or uploading content on Pintree, you grant us a:
        </p>
        <p className="pt-4">
          <span className="font-aeonik-bold">
            Worldwide, non-exclusive, royalty-free, transferable, and
            sublicensable license to
          </span>
          use, host, store, reproduce, modify, adapt, publish, translate, create
          derivative works from, display and distribute your content in
          connection with operating, improving, promoting and providing the
          Services.{" "}
        </p>
        <p className="pt-4">This includes: </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>Displaying your content to other users</li>
          <li>
            {" "}
            Using it in feeds, community pages, recommendations and search{" "}
          </li>
          <li>
            {" "}
            Using screenshots or samples in app previews, help materials, and
            marketing related to Pintree (in a reasonable manner)
          </li>
        </ul>
        <p className="pt-4">
          You can delete your content at any time (except where copies are
          already made for backup, legal, or compliance reasons). Some content
          may remain in backups or logs for a limited time.
        </p>
        <p className="pt-8 font-aeonik-bold">
          6.4 Public vs. restricted content
        </p>
        <p className="pt-4">Depending on your settings:</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            {" "}
            Some content may be visible to all users or members of a
            community/room
          </li>
          <li>
            {" "}
            Some content may be visible only to approved connections or specific
            groups
          </li>
        </ul>
        <p className="pt-4">
          Please check your privacy and visibility settings carefully before
          posting.
        </p>
        <p className="pt-8 font-aeonik-bold">6.5 Our rights over content</p>
        <p className="pt-4">
          We may, at our discretion,{" "}
          <span className="font-aeonik-bold">
            remove, limit, or restrict access
          </span>{" "}
          to any User Content if:
        </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            It appears to violate these Terms, our Community Guidelines, or
            applicable law
          </li>
          <li>
            It is reported by other users and found problematic after review
          </li>
          <li>
            {" "}
            It poses a risk to other users, public safety, or our Services
          </li>
        </ul>
        <p className="pt-4">
          We are not obligated to store or keep your content online forever. You
          are encouraged to keep your own backup copies of important content.
        </p>
        <h1 className="pt-8 font-aeonik-bold">7. Intellectual Property</h1>
        <p className="pt-8 font-aeonik-bold">7.1 Our IP</p>
        <p className="pt-4">
          The Platform, including the Pintree name and logo, design, code,
          features, and all related intellectual property are owned or licensed
          by MCABEE DIGITAL.
        </p>
        <p className="pt-4">
          Except for the limited license given under these Terms, no rights are
          granted to you. You may not copy, modify, distribute, sell, or lease
          any part of our Services or included software, nor may you reverse
          engineer or attempt to extract the source code, except as allowed by
          law.
        </p>
        <p className="pt-8 font-aeonik-bold">7.2 Respecting others’ IP</p>
        <p className="pt-4">
          You must not upload, post or share content that infringes another
          party’s copyrights, trademarks or other intellectual property rights.
          We may disable or terminate accounts that repeatedly infringe IP
          rights.
        </p>
        <p className="pt-4">
          {" "}
          If you believe your rights are being infringed on Pintree, you can
          contact us at
          <span className="font-aeonik-bold">contact@pintree.co</span> with
          relevant details. We may remove or disable access to content after
          assessment.
        </p>
        <h1 className="pt-8 font-aeonik-bold">
          8. Safety, Reporting, and Our Responsibility
        </h1>
        <p className="pt-8 font-aeonik-bold">8.1 Reporting violations</p>
        <p className="pt-4">
          You can report content, profiles or communities that you believe
          violate these Terms or our Community Guidelines. We will review
          reasonable reports and may take actions such as:{" "}
        </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>Removing or limiting content</li>
          <li>Restricting functionality</li>
          <li>Suspending or terminating accounts</li>
        </ul>
        <p className="pt-8 font-aeonik-bold">8.2 Our efforts and limitations</p>
        <p className="pt-4">
          We actively work to keep Pintree safe, respectful, and reliable. This
          includes:
        </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>Moderation workflows</li>
          <li>Automated and manual checks</li>
          <li>Policy enforcement and user training</li>
        </ul>
        <p className="pt-4">
          However, we cannot guarantee that all user-generated content will
          always be lawful, accurate, or appropriate.
        </p>
        <p className="pt-4">
          We try our best to provide a better and safer experience on Pintree.
          However, natural issues, technical failures, errors, or misuse by
          others may still occur. By using the Platform, you understand and
          agree that no online service is perfect, and you use Pintree at your
          own discretion and risk.
        </p>
        <p className="pt-8 font-aeonik-bold">
          8.3 No responsibility for user content{" "}
        </p>
        <p className="pt-4">
          Pintree does not generally pre-approve or endorse user content.
          Opinions and posts shared by users do not represent our views. To the
          maximum extent allowed by law, we are not liable for:
        </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li> Content posted by users </li>
          <li>
            Actions or omissions of other users or third parties on or off the
            Platform
          </li>
        </ul>
      </div>
    </div>
  );
};

export default page;
