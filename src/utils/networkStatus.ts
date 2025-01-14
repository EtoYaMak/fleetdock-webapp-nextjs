export const checkOnlineStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/health-check");
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
