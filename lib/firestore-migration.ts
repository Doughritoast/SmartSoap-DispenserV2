import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { MOCK_DISPENSERS, MOCK_EVENTS } from "./mock-data";
import type { Dispenser, Event } from "./mock-data";

/**
 * Migrate mock dispensers to Firestore
 */
export const migrateDispensersToFirestore = async () => {
  try {
    const dispensersRef = collection(db, "dispensers");

    for (const dispenser of MOCK_DISPENSERS) {
      await setDoc(doc(dispensersRef, dispenser.id), {
        ...dispenser,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log(`Successfully migrated ${MOCK_DISPENSERS.length} dispensers to Firestore`);
  } catch (error) {
    console.error("Error migrating dispensers:", error);
    throw error;
  }
};

/**
 * Migrate mock events to Firestore
 */
export const migrateEventsToFirestore = async () => {
  try {
    const eventsRef = collection(db, "events");

    for (const event of MOCK_EVENTS) {
      await setDoc(doc(eventsRef, event.id), {
        ...event,
        createdAt: new Date(),
      });
    }

    console.log(`Successfully migrated ${MOCK_EVENTS.length} events to Firestore`);
  } catch (error) {
    console.error("Error migrating events:", error);
    throw error;
  }
};

/**
 * Create default admin and maintenance users in Firestore
 */
export const createDefaultUsersInFirestore = async () => {
  try {
    const usersRef = collection(db, "users");

    const defaultUsers = [
      {
        id: "admin-1",
        name: "Admin User",
        email: "admin@school.com",
        role: "admin",
        createdAt: new Date(),
      },
      {
        id: "maint-1",
        name: "John Maintenance",
        email: "maintenance@school.com",
        role: "maintenance",
        employeeId: "EMP001",
        shift: "morning",
        assignedDispensers: ["disp-1", "disp-2"],
        createdAt: new Date(),
      },
    ];

    for (const user of defaultUsers) {
      const userDoc = await getDocs(query(usersRef, where("email", "==", user.email)));
      if (userDoc.empty) {
        await setDoc(doc(usersRef, user.id), user);
      }
    }

    console.log("Default users created in Firestore");
  } catch (error) {
    console.error("Error creating default users:", error);
    throw error;
  }
};

/**
 * Get all dispensers from Firestore
 */
export const getDispensersFromFirestore = async (): Promise<Dispenser[]> => {
  try {
    const dispensersRef = collection(db, "dispensers");
    const snapshot = await getDocs(dispensersRef);
    return snapshot.docs.map((doc) => doc.data() as Dispenser);
  } catch (error) {
    console.error("Error fetching dispensers:", error);
    throw error;
  }
};

/**
 * Get all events from Firestore
 */
export const getEventsFromFirestore = async (): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, "events");
    const snapshot = await getDocs(eventsRef);
    return snapshot.docs.map((doc) => doc.data() as Event);
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

/**
 * Get dispensers assigned to a specific maintenance user
 */
export const getAssignedDispensersFromFirestore = async (
  userId: string
): Promise<Dispenser[]> => {
  try {
    const dispensersRef = collection(db, "dispensers");
    const q = query(dispensersRef, where("assignedTo", "array-contains", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as Dispenser);
  } catch (error) {
    console.error("Error fetching assigned dispensers:", error);
    throw error;
  }
};

/**
 * Get events for a specific dispenser
 */
export const getDispenserEventsFromFirestore = async (
  dispenserId: string
): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("dispenserId", "==", dispenserId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as Event);
  } catch (error) {
    console.error("Error fetching dispenser events:", error);
    throw error;
  }
};
