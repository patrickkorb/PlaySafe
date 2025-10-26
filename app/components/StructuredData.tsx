import Script from 'next/script'

export function OrganizationSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    "name": "PlaySafe",
    "description": "Sportverletzung Versicherung für Freizeitaktivitäten mit schneller Auszahlung",
    "url": "https://playsafe.fit",
    "logo": "https://playsafe.fit/images/logo.png",
    "image": "https://playsafe.fit/images/logo.png",
    "email": "mike.allmendinger@signal-iduna.net",
    "telephone": "+491629436375",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "DE"
    },
    "sameAs": [
      "https://playsafe.fit"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+491629436375",
      "contactType": "customer service",
      "availableLanguage": ["de"],
      "areaServed": "DE"
    },
    "offers": {
      "@type": "Offer",
      "name": "Sportverletzung Versicherung",
      "description": "Unfallversicherung für Freizeitsportler mit Schmerzensgeld bis 2.000€ und Invaliditätsleistung bis 1.000.000€",
      "priceCurrency": "EUR",
      "price": "10.00",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "10.00",
        "priceCurrency": "EUR",
        "unitText": "MONTH"
      }
    }
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  )
}

export function ServiceSchema() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Sportverletzung Versicherung",
    "provider": {
      "@type": "InsuranceAgency",
      "name": "PlaySafe"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Deutschland"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Unfallversicherung Leistungen",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Schmerzensgeld",
            "description": "Bis zu 2.000€ bei Knochenbruch oder vollständigem Muskel-, Sehnen-, Bänder- oder Kapselriss"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Invaliditätsleistung",
            "description": "Bis zu 1.000.000€ bei dauerhafter unfallbedingter Beeinträchtigung"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Krankenhaustagegeld",
            "description": "Bis zu 50€ pro Tag bei unfallbedingter stationärer Behandlung"
          }
        }
      ]
    }
  }

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  )
}

export function FAQPageSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Greift der Versicherungsschutz nur bei Verletzungen, die während sportlicher Aktivitäten entstehen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nein, unsere PlaySafe-Verträge/Produkte decken alle Risiken in deiner kompletten Freizeit ab. Egal ob beim Sport, im Urlaub oder Zuhause."
        }
      },
      {
        "@type": "Question",
        "name": "Wie schnell erhalte ich mein Schmerzensgeld?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Im Schadenfall findest du das Schmerzensgeld in der Regel innerhalb von einer Woche auf deinem Konto. Wir legen großen Wert auf eine schnelle und unkomplizierte Abwicklung."
        }
      },
      {
        "@type": "Question",
        "name": "Bin ich auch im Ausland versichert?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, unser Versicherungsschutz gilt weltweit. Egal ob du in Deutschland oder im Ausland unterwegs bist - du bist rundum geschützt."
        }
      },
      {
        "@type": "Question",
        "name": "Was kostet PlaySafe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Kosten sind individuell und hängen von verschiedenen Faktoren ab. Kontaktiere uns für ein persönliches Angebot, das genau auf deine Bedürfnisse zugeschnitten ist."
        }
      },
      {
        "@type": "Question",
        "name": "Welche Unterlagen muss ich zur Auszahlung des Schmerzensgeldes einreichen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Eine Bescheinigung mit der Diagnose von deinem behandelnden Arzt reicht uns vollkommen aus."
        }
      },
      {
        "@type": "Question",
        "name": "Was ist, wenn ich bereits eine Unfallversicherung habe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Schick uns einfach den Versicherungsschein deiner bestehenden Unfallversicherung zu. Wir prüfen deinen Schutz und bieten Dir eine kombinierte Unfallversicherung inkl./ mit Sportschutz an. So sparst du Geld und hast beide Absicherungen in einer Police."
        }
      },
      {
        "@type": "Question",
        "name": "Wie finanziert sich PlaySafe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die SIGNAL IDUNA Versicherung steht als großer und erfolgreicher Partner hinter uns."
        }
      },
      {
        "@type": "Question",
        "name": "Zahle ich höhere Beiträge, wenn ich im Handwerk tätig bin?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nein, jeder Berufstätige zahlt bei uns den gleichen Beitrag. Bist du im öffentlichen Dienst beschäftigt, profitierst du sogar noch von weiteren Ersparnissen."
        }
      },
      {
        "@type": "Question",
        "name": "Kann unsere Mannschaft auch über PlaySafe informiert werden?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sehr gerne, wir halten regelmäßig Vorträge bei Sportvereinen. Meldet euch einfach und wir kommen nach Eurem Training mit Kaltgetränken zu einem 10-minütigen Infogespräch zum Thema Sportschutz vorbei."
        }
      }
    ]
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  )
}
