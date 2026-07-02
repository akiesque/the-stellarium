import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const AboutMeTab = () => {
  return (
    <motion.div className="relative w-full space-y-20">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Engine & Toolset
          </p>
          <h2 className="font-display text-3xl font-bold">Technical Stack</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="p-6 border border-border bg-card/40 rounded-2xl backdrop-blur-sm space-y-3">
            <h3 className="font-semibold text-base tracking-wide text-foreground">
              Data Science
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Python",
                "SQL",
                "RStudio",
                "Pandas",
                "NumPy",
                "Kaggle API",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono bg-secondary/50 rounded-md text-muted-foreground border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 border border-border bg-card/40 rounded-2xl backdrop-blur-sm space-y-3">
            <h3 className="font-semibold text-base tracking-wide text-foreground">
              Front-end Development
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "React",
                "TypeScript",
                "Vite",
                "Tailwind CSS",
                "JavaScript",
                "HTML5",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono bg-secondary/50 rounded-md text-muted-foreground border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 border border-border bg-card/40 rounded-2xl backdrop-blur-sm space-y-3">
            <h3 className="font-semibold text-base tracking-wide text-foreground">
              Machine Learning
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "PyTorch",
                "Git / GitHub",
                "Scikit-learn",
                "Transformers",
                "OpenCV",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono bg-secondary/50 rounded-md text-muted-foreground border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Foundations
          </p>
          <h2 className="font-display text-3xl font-bold">Education</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="relative border-l border-border/80 ml-2 space-y-10 py-1"
        >
          {/* Degree Tracker */}
          <div className="relative pl-6 group">
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-border group-hover:bg-teal-500 transition-colors duration-300" />
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-semibold text-lg text-foreground">
                  B.S. Computer Science with Specialization in Intelligent
                  Systems
                </h3>
                <span className="text-xs text-muted-foreground sm:text-right">
                  Graduating August 4, 2026
                </span>
              </div>
              <p className="text-sm uppercase font-semibold tracking-wider text-teal-500">
                De La Salle University - Dasmariñas, Philippines
              </p>
              <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
                Focused on developing a strong foundation in computer science,
                with a specialization in intelligence systems. Gained knowledge
                and skills in areas such as artificial intelligence, machine
                learning, data analysis, and software engineering.
              </p>
            </div>
          </div>

          <div className="relative pl-6 group">
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-border group-hover:bg-teal-500 transition-colors duration-300" />
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-semibold text-lg text-foreground">
                  Accountancy, Business and Management (ABM)
                </h3>
                <span className="text-xs text-muted-foreground sm:text-right">
                  2020 - 2022
                </span>
              </div>
              <p className="text-sm uppercase font-semibold tracking-wider text-teal-500">
                De La Salle University - Dasmariñas, Philippines
              </p>
              <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
                Completed Senior High School in accountancy, business, and
                management, gaining a solid foundation in financial principles,
                statistics, business operations, and management strategies.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Badges & Training
          </p>
          <h2 className="font-display text-3xl font-bold">Certifications</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="p-6 border border-border bg-card/40 rounded-2xl backdrop-blur-sm space-y-5">
            <div>
              <h3 className="font-bold text-md tracking-wider text-teal-600 mb-4">
                Data & Analytics Tracks
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: "Data Science Essentials with Python",
                    issue: "issued by Cisco Networking Academy",
                    url: "https://www.credly.com/badges/2af54cef-6a6c-4853-bef8-b67b9124960c/public_url",
                    skills: "Python, Pandas, Jupyter Notebook",
                  },
                  {
                    title: "Introduction to Data Science",
                    issue: "issued by Cisco Networking Academy",
                    url: "https://www.credly.com/badges/ecb323ee-b12c-4570-9100-b6a24d6ee244/linked_in_profile",
                    skills: "Data Analysis, Data Collection, Data Validation",
                  },
                  {
                    title: "SQL Essential Training",
                    issue: "issued by LinkedIn Learning",
                    url: "https://www.linkedin.com/learning/certificates/407229f8a66d27aaa3494eee9f7e52ccb3aafbd30801dffd353173996b2203dc?trk=share_certificate&lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BD1VG5qdKS%2FO8FkpkuvvJmA%3D%3D",
                    skills: "SQL, DB Browser for SQLite, Database Management",
                  },
                  {
                    title: "Statistics Foundations: 1, 2, 3",
                    issue: "issued by LinkedIn Learning",
                    url: "https://www.linkedin.com/learning/certificates/d2d26496ddf68a2a02b7bd462bf9dd926e455cf449e4957cae0baa93928b7db0?trk=share_certificate",
                    skills:
                      "Statistics, Probability, Data Analysis, Data Visualization",
                  },
                ].map((cert, index) => (
                  <a
                    key={index}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group p-3 -mx-3 rounded-xl hover:bg-secondary/40 border border-transparent hover:border-border/60 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm text-foreground group-hover:text-teal-500 transition-colors duration-200">
                        {cert.title}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-teal-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {cert.issue}
                    </span>
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                      {cert.skills}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border border-border bg-card/40 rounded-2xl backdrop-blur-sm space-y-5">
            <div>
              <h3 className="font-bold text-md tracking-wider text-teal-600 mb-4">
                Development & Systems
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: "HTML Essentials",
                    issue: "issued by Cisco Networking Academy",
                    url: "https://www.netacad.com/certificates/?issuanceId=709775bd-bb0c-44a0-9b11-7f116072677b",
                    skills: "HTML5, CSS, Web Development",
                  },
                  {
                    title: "DevNet Associate",
                    issue: "issued by Cisco Networking Academy",
                    url: "https://www.netacad.com/certificates/?issuanceId=c9dbb953-f00d-411d-b2a9-82fed01ef3b2",
                    skills: "DevNet Associate",
                  },
                ].map((cert, index) => (
                  <a
                    key={index}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group p-3 -mx-3 rounded-xl hover:bg-secondary/40 border border-transparent hover:border-border/60 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm text-foreground group-hover:text-teal-500 transition-colors duration-200">
                        {cert.title}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-teal-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {cert.issue}
                    </span>
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                      {cert.skills}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutMeTab;
