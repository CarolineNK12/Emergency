import './footer.css'

export const footerItems = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3 11.4 12 3l9 8.4v8.6a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1v-8.6Z" />
      </svg>
    ),
  },
  {
    label: 'Alerts',
    href: '/alerts',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 4.5 3 18h18L12 4.5Zm0 4.5a.9.9 0 0 1 .9.9v3.6a.9.9 0 0 1-1.8 0V9.9A.9.9 0 0 1 12 9Zm0 7.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"/>
      </svg>
    ),
  },
  {
    label: 'Map',
    href: '/map',
    primary: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 5.5 9 3v15l-5 2V5.5Zm7 0 5-2v15l-5 2V5.5Zm6 0 3-1.2V19l-3 1.2V5.5Z" />
      </svg>
    ),
  },
  {
    label: 'Guide',
    href: '/guide',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5V5Zm2 2v10h10V7H7Zm2 2h2v2H9V9Zm4 0h2v2h-2V9Z" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2.5c-3 0-5.5 1.4-5.5 3.5V21h11v-3a3.5 3.5 0 0 0-5.5-3.5Z" />
      </svg>
    ),
  },
]

function Footer() {
  return (
    <footer className="footer-bar" role="contentinfo">
      <div className="footer-bar__inner">
        {footerItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`footer-bar__item ${item.primary ? 'footer-bar__item--primary' : ''}`}
            aria-label={item.label}
          >
            <span className="footer-bar__icon">{item.icon}</span>
            <span className="footer-bar__label">{item.label}</span>
          </a>
        ))}
      </div>
    </footer>
  )
}

export default Footer
