import React, { useState, useEffect } from 'react';

const IconWithFallback = ({ 
  iconClass, 
  emoji, 
  className = '', 
  ariaLabel = '',
  ...props 
}) => {
  const [fontAwesomeLoaded, setFontAwesomeLoaded] = useState(false);

  useEffect(() => {
    // Vérifier si FontAwesome est chargé
    const checkFontAwesome = () => {
      const testElement = document.createElement('i');
      testElement.className = iconClass;
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      document.body.appendChild(testElement);
      
      const computedStyle = window.getComputedStyle(testElement, '::before');
      const fontFamily = computedStyle.getPropertyValue('font-family');
      
      document.body.removeChild(testElement);
      
      // FontAwesome est chargé si la font-family contient "Font Awesome"
      setFontAwesomeLoaded(fontFamily.includes('Font Awesome'));
    };

    // Vérifier immédiatement
    checkFontAwesome();

    // Vérifier à nouveau après un délai (au cas où FontAwesome se charge plus tard)
    const timeout = setTimeout(checkFontAwesome, 1000);

    return () => clearTimeout(timeout);
  }, [iconClass]);

  if (fontAwesomeLoaded) {
    return (
      <i 
        className={`${iconClass} ${className}`} 
        aria-label={ariaLabel}
        {...props}
      />
    );
  }

  // Fallback vers l'emoji
  return (
    <span 
      className={`text-lg ${className}`} 
      role="img" 
      aria-label={ariaLabel}
      {...props}
    >
      {emoji}
    </span>
  );
};

export default IconWithFallback;


