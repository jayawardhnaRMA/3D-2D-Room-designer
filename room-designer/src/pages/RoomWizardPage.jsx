import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWizard } from "../context/WizardContext";
import { savePendingEditorConfig } from "../utils/storage";
import PrimaryButton from "../components/common/PrimaryButton";
import SecondaryButton from "../components/common/SecondaryButton";
import WizardLayout from "../components/wizard/WizardLayout";
import StepRoomType from "../components/wizard/StepRoomType";
import StepDimensions from "../components/wizard/StepDimensions";
import StepShape from "../components/wizard/StepShape";
import StepColors from "../components/wizard/StepColors";
import StepLighting from "../components/wizard/StepLighting";
import StepReview from "../components/wizard/StepReview";

const TOTAL_STEPS = 6;

export default function RoomWizardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { wizardData, updateWizardData } = useWizard();
  const [step, setStep] = useState(1);
  const [projectNameApplied, setProjectNameApplied] = useState(false);

  useEffect(() => {
    const incomingProjectName = location.state?.projectName;

    if (incomingProjectName && !projectNameApplied) {
      updateWizardData("projectName", incomingProjectName);
      setProjectNameApplied(true);
    }
  }, [location.state?.projectName, projectNameApplied]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleLaunchEditor = () => {
    savePendingEditorConfig(wizardData);
    navigate("/designer", { state: { config: wizardData } });
  };

  const stepMeta = {
    1: {
      title: "Select Room Type",
      subtitle: "Choose the type of room you want to visualize.",
      content: (
        <StepRoomType
          value={wizardData.roomType}
          onChange={(value) => updateWizardData("roomType", value)}
        />
      ),
    },
    2: {
      title: "Room Dimensions",
      subtitle: "Set up your room size and measurement unit.",
      content: (
        <StepDimensions
          value={wizardData.dimensions}
          onChange={(value) => updateWizardData("dimensions", value)}
        />
      ),
    },
    3: {
      title: "Room Shape Selection",
      subtitle: "Choose the shape that best matches your room.",
      content: (
        <StepShape
          value={wizardData.shape}
          onChange={(value) => updateWizardData("shape", value)}
        />
      ),
    },
    4: {
      title: "Color Scheme Selection",
      subtitle: "Choose wall color and floor material.",
      content: (
        <StepColors
          value={wizardData.colors}
          onChange={(value) => updateWizardData("colors", value)}
        />
      ),
    },
    5: {
      title: "Lighting Options",
      subtitle: "Configure natural light and fixtures for the project.",
      content: (
        <StepLighting
          value={wizardData.lighting}
          onChange={(value) => updateWizardData("lighting", value)}
        />
      ),
    },
    6: {
      title: "Review & Confirm",
      subtitle: "Check your room data before launching the editor.",
      content: <StepReview data={wizardData} />,
    },
  };

  const current = stepMeta[step];

  return (
    <WizardLayout
      title={current.title}
      subtitle={current.subtitle}
      currentStep={step}
      totalSteps={TOTAL_STEPS}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <SecondaryButton onClick={step === 1 ? () => navigate("/dashboard") : prevStep}>
            {step === 1 ? "Cancel" : "Back"}
          </SecondaryButton>

          {step < TOTAL_STEPS ? (
            <PrimaryButton onClick={nextStep}>Next Step</PrimaryButton>
          ) : (
            <PrimaryButton onClick={handleLaunchEditor}>
              Launch Editor
            </PrimaryButton>
          )}
        </div>
      }
    >
      {current.content}
    </WizardLayout>
  );
}