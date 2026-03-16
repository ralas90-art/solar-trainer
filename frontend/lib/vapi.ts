import Vapi from "@vapi-ai/web";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "demo-public-key");

export const startVapiCall = async (assistantId?: string) => {
    try {
        // If no assistantId is provided, Vapi will use the one configured in the dashboard
        // or we can pass a transient assistant config.
        // For now, we'll assume we might pass a specific assistant ID or null to verify connection.
        if (assistantId) {
            return await vapi.start(assistantId);
        }
        // If we want to start with a transient assistant (defined in backend), we'd fetch that config first.
        // For this MVP, we will assume the user puts their Public Key in .env and uses a configured assistant
        // OR we will create a transient assistant in the next step.
        // Let's stick to the simplest start for now.
        return await vapi.start("transient-assistant-id-placeholder");
    } catch (err) {
        console.error("Error starting Vapi call:", err);
        throw err;
    }
};

export const stopVapiCall = () => {
    vapi.stop();
};

export const setMuted = (muted: boolean) => {
    vapi.setMuted(muted);
};

export default vapi;
