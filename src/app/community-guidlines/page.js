import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const page = () => {
  return (
<>
      <Navbar />

    <div className="mb-10 px-[24px]">
      <h1 className="text-[48px] sm:text-[96px] font-aeonik-medium text-[#1A1A1A] pb-[25px] text-left xl:text-center pt-[100px] md:pt-[180px]">
        Community Guidelines
      </h1>
      <p className="text-[16px] sm:text-[24px] font-aeonik-regular text-left xl:text-center text-[#1A1A1A]">
        Our principles for respectful conversations, responsible sharing, and
        <br className="hidden sm:inline-block"/> a trusted community space.
      </p>
      <div className="text-[16px] sm:text-[24px] text-[#000000] font-aeonik-regular xl:px-[240px]">
        <p className="pt-[54px] font-aeonik-bold">
          Pintree Community Guidelines
        </p>
        <p className="pt-4">Last Updated: 2025 December 31</p>
        <p className="pt-4">
          A Safe, Respectful Space for Meaningful Communities
        </p>
        <p className="pt-4">
          Pintree is built to support thoughtful conversations, genuine
          connections, and healthy communities. These Community Guidelines
          explain what is allowed on Pintree, what is not, and how we take
          action when rules are violated.
        </p>
        <p className="pt-4">
          By using Pintree, you agree to follow these guidelines along with our
          Terms of Use and Privacy Policy.
        </p>
        <h1 className="pt-8 font-aeonik-medium">1. Our Community Values</h1>
        <p className="pt-4">We expect everyone on Pintree to act with:</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li> Respect for individuals and communities</li>
          <li> Honesty in identity and content</li>
          <li> Responsibility in sharing information</li>
          <li> Safety for all age groups (13+)</li>
        </ul>
        <p className="pt-4">
          Pintree is not designed for chaos, shock value, or exploitation.
          Content that harms people, spreads fear, or misleads users has no
          place here.
        </p>
        <h1 className="pt-8 font-aeonik-medium">
          2. Content That Is Not Allowed (Banned Content)
        </h1>
        <p className="pt-4">
          The following content is strictly prohibited on Pintree and may result
          in immediate action:
        </p>
        <p className="pt-8 font-aeonik-medium">2.1 Hate, Abuse & Harassment</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            {" "}
            Hate speech targeting individuals or groups based on religion,
            caste, race, gender, nationality, disability, or sexual orientation
          </li>
          <li> Threats, bullying, intimidation, or repeated harassment</li>
          <li> Dehumanizing language or calls for violence</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">
          2.2 Adult, Sexual & Explicit Content
        </h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li> Pornography or sexually explicit images</li>
          <li> Sexual content involving minors (zero tolerance)</li>
          <li> Graphic sexual descriptions or fetish content</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">2.3 Violence & Harm</h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>Graphic violence, gore, or cruelty </li>
          <li> Promotion or glorification of physical harm or self-harm</li>
          <li> Content encouraging dangerous or illegal activities</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">
          2.4 Political Manipulation & Propaganda
        </h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li> Coordinated political propaganda or paid political influence</li>
          <li> Misinformation intended to manipulate public opinion</li>
          <li> Fake narratives presented as facts</li>
        </ul>
        <p className="pt-4">
          (Neutral discussions or personal opinions are handled under “Allowed
          with Limits”)
        </p>
        <h1 className="pt-8 font-aeonik-medium">
          2.5 Misinformation & Misleading Content
        </h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li> False news presented as verified information</li>
          <li>
            {" "}
            Deliberate misinformation during emergencies or sensitive situations
          </li>
          <li> Deepfakes or manipulated images intended to deceive</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">
          2.6 Impersonation & Fake Accounts
        </h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li> Fake celebrity, public figure, or brand pages</li>
          <li> Impersonating another individual or organization</li>
          <li> Misleading usernames or profile details</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">
          2.7 Scams, Fraud & Exploitation
        </h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li> Financial scams, fake giveaways, pyramid schemes</li>
          <li> Phishing links or deceptive external redirects</li>
          <li> Selling illegal or prohibited goods</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">
          2.8 Piracy & Copyright Violations
        </h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            {" "}
            Sharing pirated content or copyrighted material without rights
          </li>
          <li> Posting stolen images, articles, or paid content</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">
          3. Content Allowed — With Responsible Limits
        </h1>
        <p className="pt-4">
          The following content is allowed, but must be shared respectfully and
          responsibly.
        </p>
        <h1 className="pt-8 font-aeonik-medium">3.1 Romance & Relationships</h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            {" "}
            Healthy discussions about love, dating, marriage, or relationships
            are allowed
          </li>
          <li> No explicit sexual content or exploitation</li>
          <li> Respect consent, privacy, and cultural sensitivity</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">3.2 Religious Content</h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            {" "}
            Religious posts, teachings, events, and community discussions are
            allowed
          </li>
          <li>
            {" "}
            No hate speech, forced conversions, or attacks on other beliefs
          </li>
          <li> Respect interfaith harmony</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">
          3.3 Caste, Community & Cultural Posts
        </h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            {" "}
            Cultural identity, history, and community discussions are allowed
          </li>
          <li>
            {" "}
            Content promoting superiority, discrimination, or hatred is not
            allowed
          </li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">3.4 Debates & Opinions</h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li> Civil debates and constructive disagreements are welcome</li>
          <li>
            {" "}
            Personal attacks, trolling, or abusive arguments are not allowed
          </li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">3.5 News & Current Affairs </h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li> Sharing news is allowed</li>
          <li> Clearly label opinions vs verified information </li>
          <li> Avoid spreading unverified or misleading content</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">
          3.6 Memes & Entertainment Pages{" "}
        </h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li> Memes, infotainment, and humor are allowed </li>
          <li>
            {" "}
            Must not promote hate, abuse, misinformation, or illegal activity
          </li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">
          4. Rules for Creators, Communities & Pro Accounts
        </h1>
        <p className="pt-8 font-aeonik-medium">4.1 Authentic Identity </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>No fake pages, fake celebrities, or misleading accounts </li>
          <li> Verification is required for Pro accounts where applicable</li>
        </ul>
        <p className="pt-8 font-aeonik-medium">4.2 Community & Room Creation</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li> Communities must have a clear purpose</li>
          <li>
            {" "}
            Spam communities, duplicate groups, or inactive misuse are not
            allowed{" "}
          </li>
          <li> Community admins are responsible for moderation</li>
        </ul>
        <p className="pt-8 font-aeonik-medium">4.3 Advertising & Promotion </p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            {" "}
            Ads are allowed only for verified business or professional accounts{" "}
          </li>
          <li>
            {" "}
            Spam promotions, misleading offers, or fake claims are prohibited
          </li>
        </ul>
        <p className="pt-8 font-aeonik-medium">4.4 Content Responsibility</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            Creators and page owners are responsible for what they publish{" "}
          </li>
          <li> Repeated violations may result in reduced reach or removal </li>
        </ul>
        <p className="pt-8 font-aeonik-medium">4.5 Inactivity</p>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            Pro accounts inactive for more than 30 days may experience reduced
            visibility
          </li>
          <li>Activity helps maintain discovery and relevance</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">5. Comments & Interactions</h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>Keep comments respectful and lawful</li>
          <li> No abusive language, threats, or illegal content</li>
          <li> Repeated toxic behavior may lead to comment restrictions</li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">
          6. Discovery, Keywords & Reach{" "}
        </h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>
            Keywords help improve content discovery and search visibility{" "}
          </li>
          <li>
            {" "}
            Misleading keywords or manipulation of discovery systems is not
            allowed
          </li>
          <li>
            {" "}
            Reach may be reduced for low-quality, spammy, or misleading content
          </li>
        </ul>
        <h1 className="pt-8 font-aeonik-medium">
          7. Enforcement & Consequences
        </h1>
        <p className="pt-4">
          We follow a progressive enforcement model, depending on severity and
          repetition:
        </p>
        <ol className="pt-4 list-decimal pl-5 ms-4 flex flex-col gap-2">
          <li>Warning – Notification and guidance</li>
          <li>Restriction – Limited commenting or posting</li>
          <li>Suspension – Temporary account block</li>
          <li>
            Permanent Ban – Account deletion for serious or repeated violations
          </li>
        </ol>
        <p className="pt-4">
          Severe violations (e.g., child safety, fraud, extreme abuse) may
          result in immediate permanent removal.
        </p>

        <h1 className="pt-8 font-aeonik-medium">8. Reporting & Moderation</h1>
        <ul className="pt-4 list-disc pl-5 ms-4 flex flex-col gap-2">
          <li>Users can report content, comments, or accounts</li>
          <li> Reports are reviewed by our moderation systems and team</li>
          <li>
            {" "}
            We may remove content even if it is not reported, if it violates
            these guidelines
          </li>
        </ul>
        <p className="pt-4">
          Pintree is not responsible for user-generated content but takes action
          once violations are identified.
        </p>
        <h1 className="pt-8 font-aeonik-medium">
          9. Updates to These Guidelines
        </h1>
        <p className="pt-4">
          We may update these Community Guidelines as Pintree evolves. Any major
          changes will be communicated within the app. Continued use of Pintree
          means acceptance of the updated guidelines.
        </p>
        <h1 className="pt-8 font-aeonik-medium">10. Contact Us</h1>
        <p className="pt-4">
          If you have questions or concerns about these guidelines, please
          contact: contact@pintree.co
        </p>
       
      </div>
    </div>
           <Footer/>

</>
  );
};

export default page;
