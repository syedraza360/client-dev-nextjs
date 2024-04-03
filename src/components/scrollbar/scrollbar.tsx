/* eslint-disable */
"use client"
import React, { useEffect, useState } from 'react';

const ScrollHideNavBar: React.FC = () => {
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [hideNavBar, setHideNavBar] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && !hideNavBar) {
        // Scrolling down
        setHideNavBar(true);
      } else if (currentScrollY < lastScrollY && hideNavBar) {
        // Scrolling up
        setHideNavBar(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, hideNavBar]);

  useEffect(() => {
    // Ensure that the navigation bar remains hidden on page load
    const hideNavBarOnLoad = () => {
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 100);
    };

    hideNavBarOnLoad();
  }, []);

  return <>{/* Your content */}</>;
};

export default ScrollHideNavBar;
