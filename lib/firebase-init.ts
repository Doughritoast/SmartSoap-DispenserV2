import { db, auth, retryFirebaseOperation } from "./firebase-config";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

/**
 * Initialize Firebase database with collections and test data
 * This should be called once when the app first loads
 */
export async function initializeFirebaseDatabase() {
  try {
    console.log("🔄 Initializing Firebase database...");

    // Check if users collection exists and has data
    const usersSnapshot = await retryFirebaseOperation(
      () => getDocs(collection(db, "users")),
      3,
      1000
    );
    
    if (usersSnapshot.empty) {
      console.log("📝 Creating test users...");
      
      // Create admin user
      try {
        const adminUserCred = await retryFirebaseOperation(
          () => createUserWithEmailAndPassword(
            auth,
            "admin@school.com",
            "admin123"
          ),
          3,
          1000
        );
        
        await retryFirebaseOperation(
          () => setDoc(doc(db, "users", adminUserCred.user.uid), {
            uid: adminUserCred.user.uid,
            email: "admin@school.com",
            role: "admin",
            fullName: "Admin User",
            createdAt: serverTimestamp(),
          }),
          3,
          1000
        );
        
        console.log("✅ Admin user created");
      } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
          console.log("✅ Admin user already exists");
        } else {
          console.error("❌ Error creating admin user:", error.message);
        }
      }

      // Create maintenance user
      try {
        const maintenanceUserCred = await retryFirebaseOperation(
          () => createUserWithEmailAndPassword(
            auth,
            "maintenance@school.com",
            "maint123"
          ),
          3,
          1000
        );
        
        await retryFirebaseOperation(
          () => setDoc(doc(db, "users", maintenanceUserCred.user.uid), {
            uid: maintenanceUserCred.user.uid,
            email: "maintenance@school.com",
            role: "maintenance",
            fullName: "John Maintenance",
            employeeId: "EMP001",
            shiftAssignment: "Morning",
            createdAt: serverTimestamp(),
          }),
          3,
          1000
        );
        
        console.log("✅ Maintenance user created");
      } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
          console.log("✅ Maintenance user already exists");
        } else {
          console.error("❌ Error creating maintenance user:", error.message);
        }
      }

      // Sign out the last created user
      await signOut(auth);
    } else {
      console.log(`✅ Users collection exists with ${usersSnapshot.size} users`);
    }

    // Check if dispensers collection exists
    const dispensersSnapshot = await retryFirebaseOperation(
      () => getDocs(collection(db, "dispensers")),
      3,
      1000
    );
    
    if (dispensersSnapshot.empty) {
      console.log("📝 Creating test dispensers...");
      
      const dispensers = [
        {
          id: "disp001",
          name: "Main Hallway A",
          floor: 1,
          location: "Hallway A",
          soapLevel: 85,
          batteryLevel: 92,
          usageCount: 245,
          lastRefill: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: "ok",
          assignedTo: [],
        },
        {
          id: "disp002",
          name: "Restroom 101",
          floor: 1,
          location: "Restroom 101",
          soapLevel: 35,
          batteryLevel: 45,
          usageCount: 512,
          lastRefill: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: "low",
          assignedTo: [],
        },
        {
          id: "disp003",
          name: "Cafeteria",
          floor: 1,
          location: "Cafeteria",
          soapLevel: 10,
          batteryLevel: 15,
          usageCount: 892,
          lastRefill: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          status: "critical",
          assignedTo: [],
        },
        {
          id: "disp004",
          name: "Floor 2 Hallway",
          floor: 2,
          location: "Hallway B",
          soapLevel: 72,
          batteryLevel: 88,
          usageCount: 178,
          lastRefill: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: "ok",
          assignedTo: [],
        },
        {
          id: "disp005",
          name: "Floor 2 Restroom",
          floor: 2,
          location: "Restroom 201",
          soapLevel: 0,
          batteryLevel: 5,
          usageCount: 1024,
          lastRefill: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          status: "offline",
          assignedTo: [],
        },
        {
          id: "disp006",
          name: "Floor 3 Hallway",
          floor: 3,
          location: "Hallway C",
          soapLevel: 55,
          batteryLevel: 72,
          usageCount: 334,
          lastRefill: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          status: "ok",
          assignedTo: [],
        },
      ];

      for (const dispenser of dispensers) {
        await retryFirebaseOperation(
          () => setDoc(doc(db, "dispensers", dispenser.id), dispenser),
          3,
          1000
        );
      }
      
      console.log(`✅ Created ${dispensers.length} test dispensers`);
    } else {
      console.log(`✅ Dispensers collection exists with ${dispensersSnapshot.size} dispensers`);
    }

    // Check if events collection exists
    const eventsSnapshot = await retryFirebaseOperation(
      () => getDocs(collection(db, "events")),
      3,
      1000
    );
    
    if (eventsSnapshot.empty) {
      console.log("📝 Creating test events...");
      
      const events = [
        {
          id: "evt001",
          dispenserId: "disp001",
          type: "refill",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          description: "Dispenser refilled",
          refillCount: 1,
        },
        {
          id: "evt002",
          dispenserId: "disp002",
          type: "low_soap",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          description: "Soap level low",
          soapLevel: 35,
        },
        {
          id: "evt003",
          dispenserId: "disp003",
          type: "critical",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          description: "Critical refill needed",
          soapLevel: 10,
        },
        {
          id: "evt004",
          dispenserId: "disp005",
          type: "offline",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          description: "Dispenser offline",
          batteryLevel: 5,
        },
      ];

      for (const event of events) {
        await retryFirebaseOperation(
          () => setDoc(doc(db, "events", event.id), event),
          3,
          1000
        );
      }
      
      console.log(`✅ Created ${events.length} test events`);
    } else {
      console.log(`✅ Events collection exists with ${eventsSnapshot.size} events`);
    }

    console.log("✅ Firebase database initialization complete!");
    return true;
  } catch (error) {
    console.error("❌ Error initializing Firebase database:", error);
    return false;
  }
}
