"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getValidAccessToken, authenticatedFetch } from "@/utils/auth";
import UserAvatar, { resolveProfileImageUrl } from "@/components/UserAvatar";

const mainNavLinks = [
  { href: "/", label: "About" },
  { href: "/newsroom", label: "Newsroom" },
  { href: "/support", label: "Support" },
];

function isMainNavLinkActive(link, pathname) {
  if (link.label === "About") {
    return pathname === "/" || pathname.startsWith("/about");
  }
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [storedProfile, setStoredProfile] = useState({
    fullName: "",
    handle: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    let mounted = true;

    const storedToken = localStorage.getItem("pintree_access_token");
    setStoredProfile({
      fullName: localStorage.getItem("pintree_user_full_name") || "",
      handle: localStorage.getItem("pintree_user_handle") || "",
    });

    if (!storedToken) {
      setIsAuthenticated(false);
      setUserProfile(null);
      return;
    }

    getValidAccessToken().then((token) => {
      if (!mounted) return;
      setIsAuthenticated(Boolean(token));

      if (token) {
        authenticatedFetch("https://dev.user.pintree.co/v1/users/profile")
          .then((r) => r.json())
          .then((d) => {
            if (mounted && d?.data) setUserProfile(d.data);
          })
          .catch(() => null);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      mounted = false;
    };
  }, [pathname]);

  const navFullName =
    userProfile?.fullName || storedProfile.fullName || "Your account";
  const navHandle =
    userProfile?.handleId ||
    userProfile?.handle ||
    userProfile?.username ||
    storedProfile.handle ||
    "";
  const navUsername = navHandle
    ? `@${String(navHandle).trim().replace(/^@+/, "")}`
    : navFullName !== "Your account"
      ? `@${String(navFullName).toLowerCase().replace(/\s+/g, "").replace(/^@+/, "")}`
      : "";
  const navAvatarUrl = resolveProfileImageUrl(userProfile);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#ececec] bg-white font-jakarta">
      <div className="mx-auto flex h-[68px] w-full max-w-[1340px] items-center justify-between px-8">
        {/* Left: Pintree Brand Identity */}
        <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center px-1.5 text-[#1a1a1a] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          <img
            alt="Pintree Logo"
            className="h-[28px] w-[28px] rounded-[6px] object-contain"
            src="/Group-1410097144.svg"
          />
          <svg
            width="137"
            height="28"
            viewBox="0 0 137 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block h-[28px] w-auto"
            aria-label="Pintree"
          >
            <path
              d="M118.865 25.3425C118.897 26.3024 119.105 27.2143 119.489 28.0782C119.905 28.9102 120.449 29.6461 121.121 30.286C121.793 30.8939 122.561 31.3739 123.425 31.7258C124.321 32.0778 125.265 32.2538 126.257 32.2538C127.633 32.2538 128.769 32.0138 129.665 31.5339C130.593 31.0219 131.409 30.446 132.113 29.8061C132.433 29.5181 132.705 29.3261 132.929 29.2301C133.185 29.1341 133.441 29.0861 133.696 29.0861C134.24 29.0861 134.688 29.2621 135.04 29.6141C135.424 29.934 135.616 30.382 135.616 30.9579C135.616 31.1499 135.568 31.3899 135.472 31.6778C135.376 31.9658 135.184 32.2698 134.896 32.5897C132.689 34.8615 129.809 35.9974 126.257 35.9974C124.529 35.9974 122.929 35.7094 121.457 35.1335C119.985 34.5575 118.722 33.7576 117.666 32.7337C116.61 31.6778 115.778 30.414 115.17 28.9421C114.562 27.4703 114.258 25.8385 114.258 24.0467C114.258 22.2869 114.546 20.6711 115.122 19.1992C115.73 17.6954 116.562 16.4155 117.618 15.3596C118.674 14.3037 119.921 13.4878 121.361 12.9119C122.801 12.304 124.353 12 126.017 12C128.897 12 131.297 12.8159 133.217 14.4477C135.168 16.0476 136.368 18.4153 136.816 21.551C136.88 21.9029 136.912 22.1749 136.912 22.3669C136.912 22.5588 136.912 22.7828 136.912 23.0388C136.912 24.5746 136.112 25.3425 134.512 25.3425H118.865ZM132.401 21.9829C132.369 21.087 132.209 20.2551 131.921 19.4872C131.665 18.6873 131.265 17.9993 130.721 17.4234C130.209 16.8475 129.553 16.3995 128.753 16.0796C127.985 15.7276 127.073 15.5516 126.017 15.5516C125.057 15.5516 124.145 15.7276 123.281 16.0796C122.449 16.3995 121.713 16.8475 121.073 17.4234C120.465 17.9993 119.953 18.6873 119.537 19.4872C119.153 20.2551 118.929 21.087 118.865 21.9829H132.401Z"
              fill="#101010"
            />
            <path
              d="M93.7522 25.3425C93.7842 26.3024 93.9922 27.2143 94.3762 28.0782C94.7921 28.9102 95.3361 29.6461 96.0081 30.286C96.68 30.8939 97.448 31.3739 98.3119 31.7258C99.2078 32.0778 100.152 32.2538 101.144 32.2538C102.52 32.2538 103.656 32.0138 104.551 31.5339C105.479 31.0219 106.295 30.446 106.999 29.8061C107.319 29.5181 107.591 29.3261 107.815 29.2301C108.071 29.1341 108.327 29.0861 108.583 29.0861C109.127 29.0861 109.575 29.2621 109.927 29.6141C110.311 29.934 110.503 30.382 110.503 30.9579C110.503 31.1499 110.455 31.3899 110.359 31.6778C110.263 31.9658 110.071 32.2698 109.783 32.5897C107.575 34.8615 104.695 35.9974 101.144 35.9974C99.4158 35.9974 97.8159 35.7094 96.344 35.1335C94.8721 34.5575 93.6082 33.7576 92.5523 32.7337C91.4964 31.6778 90.6644 30.414 90.0565 28.9421C89.4485 27.4703 89.1445 25.8385 89.1445 24.0467C89.1445 22.2869 89.4325 20.6711 90.0085 19.1992C90.6164 17.6954 91.4484 16.4155 92.5043 15.3596C93.5602 14.3037 94.8081 13.4878 96.248 12.9119C97.6879 12.304 99.2398 12 100.904 12C103.784 12 106.183 12.8159 108.103 14.4477C110.055 16.0476 111.255 18.4153 111.703 21.551C111.767 21.9029 111.799 22.1749 111.799 22.3669C111.799 22.5588 111.799 22.7828 111.799 23.0388C111.799 24.5746 110.999 25.3425 109.399 25.3425H93.7522ZM107.287 21.9829C107.255 21.087 107.095 20.2551 106.807 19.4872C106.551 18.6873 106.151 17.9993 105.607 17.4234C105.095 16.8475 104.439 16.3995 103.64 16.0796C102.872 15.7276 101.96 15.5516 100.904 15.5516C99.9438 15.5516 99.0319 15.7276 98.1679 16.0796C97.336 16.3995 96.6 16.8475 95.9601 17.4234C95.3521 17.9993 94.8401 18.6873 94.4242 19.4872C94.0402 20.2551 93.8162 21.087 93.7522 21.9829H107.287Z"
              fill="#101010"
            />
            <path
              d="M80.7561 16.4635H80.9001C81.444 15.1837 82.308 14.1278 83.4919 13.2959C84.6758 12.432 86.0197 12 87.5236 12C88.2276 12 88.8355 12.16 89.3475 12.4799C89.8915 12.7679 90.1634 13.2799 90.1634 14.0158C90.1634 14.8157 89.8915 15.3756 89.3475 15.6956C88.8355 16.0156 88.2116 16.1755 87.4756 16.1755H87.1396C85.3478 16.1755 83.8759 16.8155 82.724 18.0953C81.572 19.3752 80.9961 21.247 80.9961 23.7107V33.2617C80.9961 33.8056 80.9161 34.2376 80.7561 34.5575C80.5961 34.8775 80.3881 35.1335 80.1321 35.3255C79.9081 35.4854 79.6682 35.5974 79.4122 35.6614C79.1562 35.7254 78.9322 35.7574 78.7402 35.7574C78.5482 35.7574 78.3242 35.7254 78.0683 35.6614C77.8123 35.5974 77.5563 35.4854 77.3003 35.3255C77.0763 35.1335 76.8843 34.8775 76.7244 34.5575C76.5644 34.2376 76.4844 33.8056 76.4844 33.2617V14.6397C76.4844 14.1278 76.5644 13.7118 76.7244 13.3918C76.8843 13.0719 77.0763 12.8319 77.3003 12.6719C77.5243 12.5119 77.7483 12.4 77.9723 12.336C78.2283 12.272 78.4522 12.24 78.6442 12.24C78.8042 12.24 78.9962 12.272 79.2202 12.336C79.4762 12.4 79.7162 12.5119 79.9401 12.6719C80.1641 12.8319 80.3561 13.0719 80.5161 13.3918C80.6761 13.7118 80.7561 14.1278 80.7561 14.6397V16.4635Z"
              fill="#101010"
            />
            <path
              d="M73.2679 35.2277C72.4999 35.5797 71.524 35.7556 70.3401 35.7556C68.1642 35.7556 66.5163 35.1637 65.3964 33.9798C64.2765 32.764 63.7165 30.9882 63.7165 28.6524V16.3178H61.0767C60.6287 16.3178 60.2608 16.2538 59.9728 16.1258C59.7168 15.9978 59.5088 15.8378 59.3488 15.6459C59.1888 15.4539 59.0928 15.2619 59.0608 15.0699C58.9968 14.8459 58.9648 14.654 58.9648 14.494C58.9648 14.334 58.9968 14.158 59.0608 13.966C59.0928 13.7421 59.1888 13.5341 59.3488 13.3421C59.5088 13.1501 59.7168 12.9901 59.9728 12.8622C60.2608 12.7022 60.6287 12.6222 61.0767 12.6222H63.7165V8.20666C63.7165 7.69472 63.7965 7.27877 63.9565 6.9588C64.1165 6.60684 64.3085 6.35087 64.5325 6.19088C64.7884 5.99891 65.0444 5.87092 65.3004 5.80693C65.5564 5.74293 65.7804 5.71094 65.9724 5.71094C66.1644 5.71094 66.3723 5.74293 66.5963 5.80693C66.8523 5.87092 67.0923 5.99891 67.3163 6.19088C67.5723 6.35087 67.7802 6.60684 67.9402 6.9588C68.1002 7.27877 68.1802 7.69472 68.1802 8.20666V12.6222H72.5479C72.9959 12.6222 73.3479 12.7022 73.6038 12.8622C73.8918 12.9901 74.0998 13.1501 74.2278 13.3421C74.3878 13.5341 74.4838 13.7421 74.5158 13.966C74.5798 14.158 74.6118 14.334 74.6118 14.494C74.6118 14.654 74.5798 14.8459 74.5158 15.0699C74.4838 15.2619 74.3878 15.4539 74.2278 15.6459C74.0998 15.8378 73.8918 15.9978 73.6038 16.1258C73.3479 16.2538 72.9959 16.3178 72.5479 16.3178H68.1802V28.1725C68.1802 29.5803 68.4202 30.5722 68.9002 31.1482C69.4121 31.6921 70.0841 31.9641 70.916 31.9641C71.204 31.9641 71.54 31.9161 71.924 31.8201C72.2439 31.7241 72.5159 31.6761 72.7399 31.6761C73.2839 31.6761 73.7158 31.8521 74.0358 32.204C74.3558 32.556 74.5158 32.972 74.5158 33.4519C74.5158 33.8039 74.4198 34.1398 74.2278 34.4598C74.0358 34.7478 73.7158 35.0037 73.2679 35.2277Z"
              fill="#101010"
            />
            <path
              d="M42.2951 16.3675H42.4391C42.7271 15.7596 43.1111 15.1997 43.5911 14.6877C44.103 14.1438 44.679 13.6798 45.3189 13.2959C45.9589 12.8799 46.6628 12.5599 47.4308 12.336C48.1987 12.112 48.9987 12 49.8306 12C51.3025 12 52.5664 12.256 53.6224 12.7679C54.6783 13.2479 55.5582 13.9038 56.2622 14.7357C56.9661 15.5676 57.4781 16.5435 57.7981 17.6634C58.1501 18.7833 58.326 19.9831 58.326 21.263V33.2617C58.326 33.8056 58.2461 34.2376 58.0861 34.5575C57.9261 34.8775 57.7181 35.1335 57.4621 35.3255C57.2381 35.4854 56.9981 35.5974 56.7422 35.6614C56.4862 35.7254 56.2622 35.7574 56.0702 35.7574C55.8782 35.7574 55.6542 35.7254 55.3983 35.6614C55.1423 35.5974 54.8863 35.4854 54.6303 35.3255C54.4063 35.1335 54.2143 34.8775 54.0543 34.5575C53.8944 34.2376 53.8144 33.8056 53.8144 33.2617V22.7508C53.8144 21.8229 53.7344 20.943 53.5744 20.1111C53.4464 19.2792 53.1904 18.5433 52.8064 17.9034C52.4225 17.2634 51.8945 16.7515 51.2225 16.3675C50.5506 15.9836 49.6866 15.7916 48.6307 15.7916C46.8388 15.7916 45.3669 16.4795 44.215 17.8554C43.0951 19.1992 42.5351 21.007 42.5351 23.2788V33.2617C42.5351 33.8056 42.4551 34.2376 42.2951 34.5575C42.1352 34.8775 41.9272 35.1335 41.6712 35.3255C41.4472 35.4854 41.2072 35.5974 40.9512 35.6614C40.6953 35.7254 40.4713 35.7574 40.2793 35.7574C40.0873 35.7574 39.8633 35.7254 39.6073 35.6614C39.3513 35.5974 39.0954 35.4854 38.8394 35.3255C38.6154 35.1335 38.4234 34.8775 38.2634 34.5575C38.1034 34.2376 38.0234 33.8056 38.0234 33.2617V14.6397C38.0234 14.1278 38.1034 13.7118 38.2634 13.3918C38.4234 13.0719 38.6154 12.8319 38.8394 12.6719C39.0634 12.5119 39.2874 12.4 39.5113 12.336C39.7673 12.272 39.9913 12.24 40.1833 12.24C40.3433 12.24 40.5353 12.272 40.7593 12.336C41.0152 12.4 41.2552 12.5119 41.4792 12.6719C41.7032 12.8319 41.8952 13.0719 42.0552 13.3918C42.2152 13.7118 42.2951 14.1278 42.2951 14.6397V16.3675Z"
              fill="#101010"
            />
            <path
              d="M33.3316 4.41987C33.3316 5.25178 33.0276 5.9397 32.4197 6.48364C31.8437 7.02758 31.1398 7.29955 30.3078 7.29955C29.4759 7.29955 28.7719 7.02758 28.196 6.48364C27.62 5.9077 27.332 5.21978 27.332 4.41987C27.332 3.58796 27.62 2.90003 28.196 2.35609C28.7719 1.78016 29.4759 1.49219 30.3078 1.49219C31.1398 1.49219 31.8437 1.78016 32.4197 2.35609C33.0276 2.90003 33.3316 3.58796 33.3316 4.41987ZM32.5637 33.2647C32.5637 33.8086 32.4837 34.2406 32.3237 34.5606C32.1637 34.8805 31.9557 35.1365 31.6997 35.3285C31.4757 35.4854 31.2358 35.6004 30.9798 35.6644C30.7238 35.7284 30.4998 35.7604 30.3078 35.7604C30.1158 35.7604 29.8919 35.7284 29.6359 35.6644C29.3799 35.6004 29.1239 35.4885 28.8679 35.3285C28.6439 35.1365 28.452 34.8805 28.292 34.5606C28.132 34.2406 28.052 33.8086 28.052 33.2647V14.7387C28.052 14.2268 28.132 13.8108 28.292 13.4909C28.452 13.1389 28.6439 12.8829 28.8679 12.723C29.1239 12.531 29.3799 12.403 29.6359 12.339C29.8919 12.275 30.1158 12.243 30.3078 12.243C30.4998 12.243 30.7238 12.275 30.9798 12.339C31.2358 12.403 31.4757 12.531 31.6997 12.723C31.9557 12.8829 32.1637 13.1389 32.3237 13.4909C32.4837 13.8108 32.5637 14.2268 32.5637 14.7387V33.2647Z"
              fill="#101010"
            />
            <path
              d="M19.4867 11.9507C19.4867 10.8948 19.3267 9.87092 19.0067 8.87903C18.6867 7.88714 18.2068 7.00723 17.5668 6.23932C16.9268 5.4714 16.1269 4.86347 15.167 4.41552C14.239 3.96757 13.1511 3.74359 11.9032 3.74359C10.7513 3.74359 9.69534 3.96757 8.7354 4.41552C7.80747 4.86347 7.00752 5.4714 6.33557 6.23932C5.66361 7.00723 5.13565 7.88714 4.75168 8.87903C4.3997 9.87092 4.22371 10.9108 4.22371 11.9987C4.22371 13.0866 4.3997 14.1265 4.75168 15.1183C5.13565 16.1102 5.66361 16.9901 6.33557 17.7581C7.00752 18.494 7.80747 19.0859 8.7354 19.5339C9.69534 19.9818 10.7513 20.2058 11.9032 20.2058C13.1511 20.2058 14.239 19.9818 15.167 19.5339C16.1269 19.0539 16.9268 18.43 17.5668 17.6621C18.2068 16.8941 18.6867 16.0142 19.0067 15.0224C19.3267 14.0305 19.4867 13.0066 19.4867 11.9507ZM24.1424 11.9507C24.1424 13.6145 23.8704 15.1823 23.3264 16.6542C22.7824 18.126 22.0145 19.4059 21.0226 20.4938C20.0306 21.5816 18.8307 22.4455 17.4228 23.0855C16.0149 23.6934 14.431 23.9974 12.6711 23.9974C11.0392 23.9974 9.50335 23.6454 8.06345 22.9415C6.62355 22.2376 5.48763 21.2457 4.65568 19.9658H4.51169V32.7804C4.51169 33.3244 4.4317 33.7563 4.27171 34.0763C4.11172 34.3962 3.90373 34.6362 3.64775 34.7962C3.42377 34.9882 3.18378 35.1162 2.9278 35.1801C2.67182 35.2441 2.44783 35.2761 2.25585 35.2761C2.06386 35.2761 1.83987 35.2441 1.58389 35.1801C1.32791 35.1162 1.07193 34.9882 0.815945 34.7962C0.59196 34.6362 0.399973 34.3962 0.239984 34.0763C0.0799947 33.7563 0 33.3244 0 32.7804V2.68771C0 2.17576 0.0799947 1.75981 0.239984 1.43984C0.399973 1.08788 0.59196 0.83191 0.815945 0.671927C1.07193 0.511945 1.31191 0.399957 1.5359 0.335964C1.79188 0.271971 2.01586 0.239973 2.20785 0.239973C2.39984 0.239973 2.60782 0.271971 2.83181 0.335964C3.08779 0.399957 3.32777 0.511945 3.55176 0.671927C3.80774 0.83191 4.01573 1.08788 4.17572 1.43984C4.3357 1.75981 4.4157 2.17576 4.4157 2.68771V4.17554H4.55969C5.29564 2.95968 6.36757 1.96778 7.77547 1.19987C9.21537 0.399957 10.8793 0 12.7671 0C14.463 0 15.9989 0.303968 17.3748 0.911901C18.7827 1.51983 19.9826 2.36774 20.9746 3.45562C21.9985 4.5435 22.7824 5.82336 23.3264 7.2952C23.8704 8.73504 24.1424 10.2869 24.1424 11.9507Z"
              fill="#101010"
            />
          </svg>
        </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden items-center gap-9 md:flex font-jakarta"
        >
          {mainNavLinks.map((link) => {
            const isActive = isMainNavLinkActive(link, pathname);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[13.5px] font-medium transition ${
                  isActive
                    ? "text-black"
                    : "text-[#4a4a4a] hover:text-black"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-7 font-jakarta">
          <Link
            href="/#download"
            className="hidden text-[13.5px] font-medium text-[#4a4a4a] transition hover:text-black sm:inline-block"
          >
            Download App
          </Link>

          {isAuthenticated ? (
            <Link
              href="/account"
              className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1 rounded-full bg-[#f6f3f2] border border-[#e4e2e1] hover:border-[#c4c7c7] transition-colors select-none"
            >
              <div className="relative flex-shrink-0">
                <UserAvatar
                  name={navFullName}
                  src={navAvatarUrl}
                  profile={userProfile}
                  sizeClass="w-8 h-8"
                  textClass="text-[12px]"
                  alt={navFullName}
                  className="ring-1 ring-[#e4e2e1]"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#CAFFA6] ring-2 ring-white"></span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[13px] leading-tight font-semibold text-[#1b1c1c] capitalize">
                  {navFullName}
                </span>
                {navUsername ? (
                  <span className="text-[11px] leading-none text-[#747878]">
                    {navUsername}
                  </span>
                ) : null}
              </div>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={`text-[13.5px] font-medium transition ${
                  pathname === "/login"
                    ? "text-black"
                    : "text-[#111111] hover:text-black"
                }`}
              >
                Login
              </Link>
              <Link
                href="/contact"
                className="rounded-full bg-black px-5 py-2 text-[13.5px] font-medium text-white shadow-sm transition hover:bg-neutral-800"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#1b1c1c] hover:bg-[#f0eded] md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
              >
                <path
                  d="M5 5L15 15M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
              >
                <path
                  d="M3 5H17M3 10H17M3 15H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-[#e4e2e1]/80 bg-white px-6 pb-6 pt-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {mainNavLinks.map((link) => {
              const isActive = isMainNavLinkActive(link, pathname);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[15px] leading-[20px] tracking-[0.01em] transition-colors ${
                    isActive
                      ? "font-semibold text-[#1b1c1c]"
                      : "font-medium text-[#444748] hover:text-[#1b1c1c]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/#download"
              className="text-[13px] leading-[18px] font-medium tracking-[0.02em] text-[#444748] transition-colors hover:text-[#1b1c1c] sm:hidden"
              onClick={() => setMobileOpen(false)}
            >
              Download App
            </Link>

            {isAuthenticated ? (
              <Link
                href="/account"
                className={`text-[13px] leading-[18px] tracking-[0.02em] transition-colors ${
                  pathname === "/account"
                    ? "font-semibold text-[#1b1c1c]"
                    : "font-medium text-[#1b1c1c] hover:text-black"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                Account Overview
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-[13px] leading-[18px] tracking-[0.02em] transition-colors ${
                    pathname === "/login"
                      ? "font-semibold text-[#1b1c1c]"
                      : "font-medium text-[#1b1c1c] hover:text-black"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-2.5 text-[13px] leading-[18px] font-semibold tracking-[0.02em] text-white shadow-sm transition-all hover:bg-[#1c1b1b] active:scale-[0.98]"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
