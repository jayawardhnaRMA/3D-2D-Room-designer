import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWizard } from "../context/WizardContext";
import { savePendingEditorConfig } from "../utils/storage";
import { designAPI } from "../services/designAPI";
import { X } from "lucide-react";
import LoggedInNavbar from "../components/LoggedInNavbar";
import PrimaryButton from "../components/common/PrimaryButton";
import SecondaryButton from "../components/common/SecondaryButton";
import WizardLayout from "../components/wizard/WizardLayout";
import StepProjectName from "../components/wizard/StepProjectName";
import StepRoomType from "../components/wizard/StepRoomType";
import StepDimensions from "../components/wizard/StepDimensions";
import StepShape from "../components/wizard/StepShape";
import StepColors from "../components/wizard/StepColors";
import StepLighting from "../components/wizard/StepLighting";
import StepReview from "../components/wizard/StepReview";

const TOTAL_STEPS = 7;

export default function RoomWizardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { wizardData, updateWizardData } = useWizard();
  const [step, setStep] = useState(1);
  const [projectNameApplied, setProjectNameApplied] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    const incomingProjectName = location.state?.projectName;

    if (incomingProjectName && !projectNameApplied) {
      updateWizardData("projectName", incomingProjectName);
      setProjectNameApplied(true);
    }
  }, [location.state?.projectName, projectNameApplied, updateWizardData]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleLaunchEditor = async () => {
    setIsLaunching(true);
    try {
      // Check if user is authenticated via auth context
      if (!isAuthenticated || !user || !user.id) {
        alert("User not authenticated");
        navigate("/login");
        return;
      }

      const designData = {
        ...wizardData,
        items: [],
        status: "draft",
        clientId: location.state?.clientId || null,
        clientName: location.state?.clientName || null,
      };

      // Create design in API
      const res = await designAPI.createDesign(user.id, designData);
      const designId = res.design._id;

      // Also save to localStorage as backup
      savePendingEditorConfig(wizardData);

      navigate("/room-editor", {
        state: {
          config: wizardData,
          designId: designId,
          from: location.state?.from,
          clientId: location.state?.clientId,
          clientName: location.state?.clientName,
        },
      });
    } catch (error) {
      console.error("Error creating design:", error);
      // Fallback: Continue without saving if API fails
      savePendingEditorConfig(wizardData);
      navigate("/room-editor", {
        state: {
          config: wizardData,
          from: location.state?.from,
        },
      });
    } finally {
      setIsLaunching(false);
    }
  };

  const stepMeta = {
    1: {
      title: "Project Name",
      subtitle: "Give your room design project a name.",
      content: (
        <StepProjectName
          value={wizardData.projectName}
          onChange={(value) => updateWizardData("projectName", value)}
        />
      ),
    },
    2: {
      title: "Select Room Type",
      subtitle: "Choose the type of room you want to visualize.",
      content: (
        <StepRoomType
          value={wizardData.roomType}
          onChange={(value) => updateWizardData("roomType", value)}
        />
      ),
    },
    3: {
      title: "Room Dimensions",
      subtitle: "Set up your room size and measurement unit.",
      content: (
        <StepDimensions
          value={wizardData.dimensions}
          onChange={(value) => updateWizardData("dimensions", value)}
        />
      ),
    },
    4: {
      title: "Room Shape Selection",
      subtitle: "Choose the shape that best matches your room.",
      content: (
        <StepShape
          value={wizardData.shape}
          onChange={(value) => updateWizardData("shape", value)}
        />
      ),
    },
    5: {
      title: "Color Scheme Selection",
      subtitle: "Choose wall color and floor material.",
      content: (
        <StepColors
          value={wizardData.colors}
          onChange={(value) => updateWizardData("colors", value)}
        />
      ),
    },
    6: {
      title: "Lighting Options",
      subtitle: "Configure natural light and fixtures for the project.",
      content: (
        <StepLighting
          value={wizardData.lighting}
          onChange={(value) => updateWizardData("lighting", value)}
        />
      ),
    },
    7: {
      title: "Review & Confirm",
      subtitle: "Check your room data before launching the editor.",
      content: <StepReview data={wizardData} />,
    },
  };

  const current = stepMeta[step];

  const getBackDestination = () => {
    const fromPath = location.state?.from || "/customer/dashboard";
    return fromPath;
  };

  const handleClose = () => {
    navigate(getBackDestination());
  };

  // Determine user role for navbar
  const userRole = user?.role === "designer" ? "designer" : "customer";

  return (
    <>
      <LoggedInNavbar userRole={userRole} />
      <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
        <WizardLayout
          title={current.title}
          subtitle={current.subtitle}
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          onClose={handleClose}
          footer={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <SecondaryButton onClick={step === 1 ? () => navigate(getBackDestination()) : prevStep}>
                {step === 1 ? "Cancel" : "Back"}
              </SecondaryButton>

              {step < TOTAL_STEPS ? (
                <PrimaryButton onClick={nextStep}>Next Step</PrimaryButton>
              ) : (
                <PrimaryButton onClick={handleLaunchEditor} disabled={isLaunching}>
                  {isLaunching ? "Launching..." : "Launch Editor"}
                </PrimaryButton>
              )}
            </div>
          }
        >
          {current.content}
        </WizardLayout>
      </div>
    </>
  );
}
