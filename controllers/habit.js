import Habit from "../models/Habit.js";

export const createHabit = async (req, res) => {
  try {
    const { title, goal, reminderTime, repeatDays } = req.body;
    const userId = req.params.userId;

    if (!title || !goal || !reminderTime)
      return res.status(400).json({ msg: "Fill in the required fields" });
    if (!userId) return res.status(400).json({ msg: "User id is not present" });

    const newHabit = new Habit({
      title,
      goal,
      reminderTime,
      repeatDays,
      userId,
    });
    const result = await newHabit.save();
    res.status(201).json({ result, msg: "Habit created succesfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const { title, goal, reminderTime, repeatDays } = req.body;
    const { userId, habitId } = req.params;

    if (!title || !goal || !reminderTime)
      return res.status(400).json({ msg: "Fill in the required fields" });
    if (!userId) return res.status(400).json({ msg: "User id is not present" });

    const newHabit = {
      title,
      goal,
      reminderTime,
      repeatDays,
    };

    const filter = { _id: habitId };
    const result = await Habit.updateOne(filter, { $set: newHabit });
    if (result.matchedCount === 0) {
      res.status(400).json({ msg: "Habit not found." });
    }
    if (result.modifiedCount === 0) {
      res.status(400).json({ msg: "No change was made." });
    }
    if (result.upsertedCount > 0) {
      res.status(201).json({ msg: "A new habit was added." });
    }
    res.status(200).json({ result, msg: "Habit updated succesfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const { userId, habitId } = req.params;
    if (!userId || !habitId)
      return res.status(400).json({ msg: "Parameter is absent." });

    const habit = await Habit.findByIdAndDelete(habitId);
    console.log(habit);
    if (!habit) return res.status(404).json({ msg: "Habit may not exist." });

    res.status(204).json({ msg: "Habit deleted successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Marks habit complete on click of the done button
export const markComplete = async (req, res) => {
  try {
    const { userId, habitId } = req.params;
    if (!userId || !habitId)
      return res.status(400).json({ msg: "Parameter is absent." });

    const habit = await Habit.findById(habitId);
    const filter = { _id: habitId };
    if (habit.status === "incomplete") {
      const doc = { status: "complete" };
      const result = await Habit.updateOne(filter, { $set: doc });
      if (result.matchedCount === 0) {
        res.status(400).json({ msg: "Habit was not found." });
      }
      if (result.modifiedCount === 0) {
        res.status(400).json({ msg: "No change was made." });
      }
      res.status(200).json({ result, msg: "Habit marked as complete." });
    }

    if (habit.status === "complete") {
      const doc = { status: "incomplete" };
      const result = await Habit.updateOne(filter, { $set: doc });
      if (result.matchedCount === 0) {
        res.status(400).json({ msg: "Habit was not found." });
      }
      if (result.modifiedCount === 0) {
        res.status(400).json({ msg: "No change was made." });
      }
      res.status(200).json({ result, msg: "Habit marked as incomplete." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
