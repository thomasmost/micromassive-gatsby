import { useState } from "react";

export interface IActivity {
  click: number;
  text: string;
}

export const useActivityStream = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const addActivity = (click: number, text: string) => {
    const newActivities = activities.slice();
    newActivities.push({
      click,
      text
    })
    setActivities(newActivities);
  }

  const resetActivitySTream = () => {
    setActivities([]);
  }
  return {activities, addActivity, resetActivitySTream}
}
