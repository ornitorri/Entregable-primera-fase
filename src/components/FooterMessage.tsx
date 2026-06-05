
"use client";

import React from 'react';

const FooterMessage = () => {
  return (
    <div className="mt-20 pt-12 border-t border-border/50 text-center">
      <div className="max-w-4xl mx-auto">
        <p className="text-2xl md:text-3xl font-headline font-medium text-primary leading-relaxed opacity-90 animate-fade-in italic">
          &ldquo;Descubre tu universo literario. Conéctate, sueña y comparte historias con nosotros.&rdquo;
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
        </div>
      </div>
    </div>
  );
};

export default FooterMessage;
