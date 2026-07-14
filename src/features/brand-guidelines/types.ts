/** A brand guideline a person has written themselves, stored locally. */
export interface CustomGuideline {
  id: string;
  name: string;
  content: string;
}

/**
 * One selectable entry in the Brand Guidelines list — either the built-in
 * "Default" (content hidden) or one of up to 3 custom guidelines.
 */
export interface BrandGuidelineOption {
  id: string;
  name: string;
  isDefault: boolean;
}
