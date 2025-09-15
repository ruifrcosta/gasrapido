// Declarações de tipos para a aplicação web

declare module 'next/font/google' {
  export function Inter(options: any): any;
}

declare module 'next/link' {
  import React from 'react';
  
  interface LinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
  }
  
  export default function Link(props: LinkProps): JSX.Element;
}

declare module '@heroicons/react/24/outline' {
  import { SVGProps } from 'react';
  
  export const FireIcon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  export const TruckIcon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  export const ShieldCheckIcon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  export const ClockIcon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  export const MapPinIcon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  export const PhoneIcon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  export const EnvelopeIcon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

declare global {
  namespace React {
    interface ReactNode {}
  }
  
  namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};