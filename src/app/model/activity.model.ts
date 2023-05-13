
export class Activity{
  day_1: ActivityDayResponse;
  day_2: ActivityDayResponse;
  day_3: ActivityDayResponse;
  day_4: ActivityDayResponse;
  day_5: ActivityDayResponse;
  day_6: ActivityDayResponse;
  day_7: ActivityDayResponse;
}

export class ActivityDayResponse{
  currentDay: Date;
  currentDayName: string;
  doneTasks: ActivityResponse[];
}

export class ActivityResponse{
  conclusionDate: Date;
  taskDescription: string;
  categoryName: string;
}
