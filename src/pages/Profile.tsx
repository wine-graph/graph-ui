import PageHeader from "../components/common/PageHeader.tsx";
import SectionCard from "../components/common/SectionCard.tsx";
import {FaLink} from "../assets/icons.ts";
import Button from "../components/common/Button.tsx";

/**
 * Profile page for all user types
 * //todo @param userType
 */
export const ProfilePage = () => {
    return (
        <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
            <PageHeader
                title="Register for a Profile"
                desc="This platform allows you to... based on user type"
            />
            <div className="mt-5">
                <SectionCard cardHeader={{icon: FaLink, title: "Connect through Google"}}>
                    <div className="my-3 px-4">
                        <p className="text-sm text-textSecondary mb-3">
                            Want to use this platform?
                        </p>
                        <Button className="bg-textPrimary-1 hover:bg-gray-600 text-white font-medium px-4 py-2">
                            <FaLink/>
                            <span className="text-sm">Sign Up to Personalize Your Experience</span>
                        </Button>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}