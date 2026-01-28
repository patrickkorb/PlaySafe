'use client';

import Image from 'next/image';

const TESTIMONIALS = [
  {
    name: 'Max S.',
    role: 'Fußballspieler, 28',
    text: '"Nach meinem Kreuzbandriss kam das Geld innerhalb von 3 Tagen auf mein Konto. Kein Papierkram, keine Probleme - einfach perfekt!"',
  },
  {
    name: 'Sarah K.',
    role: 'Skifahrerin, 34',
    text: '"Beste Entscheidung! Als Skifahrer hatte ich schon mehrere Verletzungen. Die Versicherung hat immer sofort und unkompliziert gezahlt."',
  },
];

function StarRating() {
  return (
    <div className="flex gap-1 mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="w-5 h-5 text-secondary fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <div className="mt-4 -mx-3">
      <div className="grid md:grid-cols-2 gap-4">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.name}
            className="bg-background rounded-xl p-6 shadow-lg border border-border"
          >
            <StarRating />
            <p className="text-foreground mb-4 italic text-left">
              {testimonial.text}
            </p>
            <div className="flex items-end justify-between gap-3 border-t border-border pt-3">
              <div>
                <p className="font-semibold text-foreground text-left">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
              <Image
                src="/images/google.svg"
                alt="Google Logo"
                width={25}
                height={25}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
