export interface LoadingFact {
  id: string;
  /** The finding/stat itself, paraphrased in plain English. */
  text: string;
  /** Who found/reported it, shown as the small attribution line. */
  source: string;
}

/**
 * Real, research-backed findings about why recognition and compliments
 * matter at work — gathered during the build so the loading state has
 * something genuinely interesting to say instead of a generic spinner.
 * Paraphrased from public reporting on each study/survey; not verbatim
 * quotes from any single source.
 */
export const LOADING_FACTS: readonly LoadingFact[] = [
  {
    id: "hbr-manager-recognition",
    text: "Employees who say their manager is great at recognizing their work report being about 40% more engaged than those who say their manager isn\u2019t.",
    source: "Harvard Business Review",
  },
  {
    id: "oxford-happiness-productivity",
    text: "Happier workers are roughly 13% more productive than their less happy peers.",
    source: "University of Oxford, Sa\u00efd Business School",
  },
  {
    id: "gartner-performance-lift",
    text: "A well-designed employee recognition program can lift average performance by more than 10%.",
    source: "Gartner",
  },
  {
    id: "achievers-extra-effort",
    text: "About 9 in 10 employees say they\u2019re more willing to put in extra effort when their work actually gets noticed.",
    source: "Achievers Workforce Institute",
  },
  {
    id: "surveymonkey-happiness",
    text: "Roughly 8 in 10 employed adults say being recognized at work makes them noticeably happier day to day.",
    source: "SurveyMonkey Workplace Happiness Report",
  },
  {
    id: "glassdoor-retention",
    text: "More than half of employees say they\u2019d stay at their company longer if they simply felt more appreciated by their boss.",
    source: "Glassdoor Employee Appreciation Survey",
  },
  {
    id: "flexjobs-motivation",
    text: "A large majority of workers name feeling recognized as one of the single biggest drivers of their motivation on the job.",
    source: "FlexJobs Workforce Survey",
  },
  {
    id: "officeteam-unappreciated",
    text: "A majority of employees say they would consider leaving a job where they consistently felt unappreciated.",
    source: "OfficeTeam / Robert Half Workplace Survey",
  },
  {
    id: "gallup-repeat-behavior",
    text: "About 9 in 10 workers say they\u2019re more likely to repeat a specific action after being recognized for doing it well.",
    source: "Gallup Workplace Research",
  },
  {
    id: "gallup-trust",
    text: "On teams with frequent recognition, roughly two-thirds of employees say they genuinely trust the people they work with \u2014 a noticeably higher share than on teams without it.",
    source: "Gallup Workplace Research",
  },
];
