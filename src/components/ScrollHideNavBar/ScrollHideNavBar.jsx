'use client'
import { useEffect, useState } from 'react';

const ScrollHideNavBar = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hideNavBar, setHideNavBar] = useState(false);

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

  return (
    <div>
      {/* Your content */}
      <div className="content">Your content here</div>
    </div>
  );
};

export default ScrollHideNavBar;
