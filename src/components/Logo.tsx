'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  href?: string;
  priority?: boolean;
}

export function Logo({
  variant = 'full',
  size = 'md',
  className = '',
  href,
  priority = false,
}: LogoProps) {
  const sizeClasses = {
    sm: variant === 'icon' ? 'h-6 w-6' : 'h-7 sm:h-8 w-auto',
    md: variant === 'icon' ? 'h-8 w-8' : 'h-9 sm:h-10 w-auto',
    lg: variant === 'icon' ? 'h-10 w-10' : 'h-11 sm:h-12 w-auto',
    xl: variant === 'icon' ? 'h-14 w-14' : 'h-14 sm:h-16 w-auto',
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {variant === 'icon' ? (
        <Image
          src="/logo-icon.png"
          alt="KnowTrace"
          width={96}
          height={96}
          className={`${sizeClasses} object-contain transition-transform group-hover:scale-105`}
          priority={priority}
        />
      ) : (
        <>
          {/* Light mode logo */}
          <Image
            src="/logo.png"
            alt="KnowTrace — Learn Smarter. Go Deeper."
            width={270}
            height={88}
            className={`${sizeClasses} object-contain dark:hidden transition-transform group-hover:scale-[1.02]`}
            priority={priority}
          />
          {/* Dark mode logo */}
          <Image
            src="/logo-dark.png"
            alt="KnowTrace — Learn Smarter. Go Deeper."
            width={270}
            height={88}
            className={`${sizeClasses} object-contain hidden dark:block transition-transform group-hover:scale-[1.02]`}
            priority={priority}
          />
        </>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
