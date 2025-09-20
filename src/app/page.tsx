import {
  HeroSection,
  StorySection,
  FeaturesSection,
  CommunitySection,
  UserTypesSection,
  CTASection
} from '@/components/landing';

export default function PhotoRichHomePage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <StorySection />
      <FeaturesSection />
      <CommunitySection />
      <UserTypesSection />
      <CTASection />
    </div>
  );
}