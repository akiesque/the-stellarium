import { motion } from "motion/react";
import { Send, FileText, ExternalLink } from "lucide-react";
import ShimmerButton from "./ui/ShimmerButton";

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0.297C5.37 0.297 0 5.668 0 12.297C0 17.606 3.438 22.11 8.206 23.7C8.806 23.812 9.025 23.438 9.025 23.119C9.025 22.831 9.013 21.869 9.008 20.594C5.672 21.319 4.968 18.987 4.968 18.987C4.422 17.6 3.633 17.231 3.633 17.231C2.545 16.487 3.716 16.502 3.716 16.502C4.922 16.587 5.556 17.738 5.556 17.738C6.625 19.569 8.363 19.04 9.05 18.734C9.162 17.96 9.469 17.431 9.808 17.131C7.146 16.831 4.344 15.8 4.344 11.207C4.344 9.9 4.812 8.832 5.581 7.994C5.456 7.694 5.044 6.481 5.7 4.85C5.7 4.85 6.712 4.525 9.012 6.088C9.971 5.819 10.994 5.682 12.013 5.675C13.031 5.682 14.055 5.819 15.013 6.088C17.312 4.525 18.323 4.85 18.323 4.85C18.981 6.481 18.569 7.694 18.444 7.994C19.213 8.832 19.681 9.9 19.681 11.207C19.681 15.812 16.875 16.825 14.206 17.119C14.631 17.488 15.019 18.212 15.019 19.325C15.019 20.919 15.006 22.706 15.006 23.119C15.006 23.438 15.225 23.819 15.831 23.7C20.599 22.11 24.037 17.606 24.037 12.297C24.037 5.668 18.663 0.297 12 0.297Z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.23 0z" />
  </svg>
);

const socials = [
  {
    icon: GithubIcon,
    label: "GitHub",
    description: "View my other projects",
    href: "https://github.com/akiesque",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    description: "Connect with me on LinkedIn",
    href: "https://www.linkedin.com/in/chandrelle-stephanie-fermil-19171a1a1/",
  },
  {
    icon: Send,
    label: "Email",
    description: "Send me an email",
    href: "mailto:stephanie.fermil@gmail.com",
  },
];

const ContactTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
        Get in <span className="text-primary">touch</span>
      </h2>

      <p className="text-muted-foreground mb-10 max-w-lg leading-relaxed border-l-2 border-border pl-3">
        <span className="font-medium text-muted-foreground">
          Open to opportunities, collaborations, and coffee chats.
        </span>
      </p>

      <div className="flex items-center gap-5 mb-10">
        <div className="w-20 h-20 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
          <img
            src="/profile.jpg"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div>
          <p className="text-lg font-semibold">Stephanie Fermil</p>
          <p className="text-sm text-muted-foreground">
            Aspiring Data Scientist · Singapore
          </p>
        </div>
      </div>

      {/* Socials */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Socials
        </p>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch">
          {socials.map(({ icon: Icon, label, description, href }) => (
            <ShimmerButton
              key={href}
              label={label}
              description={description}
              icon={
                <Icon className="w-5 h-5 text-[hsl(var(--nav-active-text))]" />
              }
              onClick={() => {
                window.open(href, "_blank");
              }}
            />
          ))}
        </div>
      </div>

      {/* Resume */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Want to hire me?
        </p>
        <a
          href="/StephanieFermil_Resume.pdf"
          download="StephanieFermil_Resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-secondary transition-colors text-sm font-medium"
        >
          <FileText className="w-4 h-4" />
          View resume
          <ExternalLink className="w-3 h-3 text-muted-foreground" />
        </a>
      </div>
    </motion.div>
  );
};

export default ContactTab;
