import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDocs, 
  writeBatch,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  Constituent, 
  AssistanceRequest, 
  DisasterReliefEvent, 
  QueueTicket, 
  SocialCaseStudyReport,
  ActivityLog
} from '../types';
import {
  INITIAL_CONSTITUENTS,
  INITIAL_ASSISTANCE_REQUESTS,
  INITIAL_DISASTER_EVENTS,
  INITIAL_QUEUE_TICKETS,
  INITIAL_REPORTS,
  INITIAL_ACTIVITY_LOGS
} from '../mockData';

// Collections
const CONSTITUENTS_COL = 'constituents';
const ASSISTANCE_COL = 'assistanceRequests';
const DISASTER_COL = 'disasterEvents';
const QUEUE_COL = 'queueTickets';
const REPORTS_COL = 'reports';
const LOGS_COL = 'activityLogs';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// Connection test on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Auto seed initial data if Firestore is empty
export async function seedInitialDataIfEmpty() {
  try {
    const constSnap = await getDocs(collection(db, CONSTITUENTS_COL));
    if (constSnap.empty) {
      console.log('Firestore is empty. Seeding initial MSWDO records...');
      const batch = writeBatch(db);

      INITIAL_CONSTITUENTS.forEach((item) => {
        batch.set(doc(db, CONSTITUENTS_COL, item.id), item);
      });
      INITIAL_ASSISTANCE_REQUESTS.forEach((item) => {
        batch.set(doc(db, ASSISTANCE_COL, item.id), item);
      });
      INITIAL_DISASTER_EVENTS.forEach((item) => {
        batch.set(doc(db, DISASTER_COL, item.id), item);
      });
      INITIAL_QUEUE_TICKETS.forEach((item) => {
        batch.set(doc(db, QUEUE_COL, item.id), item);
      });
      INITIAL_REPORTS.forEach((item) => {
        batch.set(doc(db, REPORTS_COL, item.id), item);
      });
      INITIAL_ACTIVITY_LOGS.forEach((item) => {
        batch.set(doc(db, LOGS_COL, item.id), item);
      });

      await batch.commit();
      console.log('Initial real-time data seeded successfully.');
    }
  } catch (err) {
    console.warn('Error during auto-seeding:', err);
  }
}

// Subscriptions with strict Deduplication by ID
export function subscribeConstituents(callback: (data: Constituent[]) => void) {
  const colRef = collection(db, CONSTITUENTS_COL);
  return onSnapshot(colRef, (snapshot) => {
    const map = new Map<string, Constituent>();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Constituent;
      const id = docSnap.id || data.id;
      if (id) {
        map.set(id, { ...data, id });
      }
    });
    const list = Array.from(map.values());
    callback(list);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, CONSTITUENTS_COL);
  });
}

export function subscribeAssistanceRequests(callback: (data: AssistanceRequest[]) => void) {
  const colRef = collection(db, ASSISTANCE_COL);
  return onSnapshot(colRef, (snapshot) => {
    const map = new Map<string, AssistanceRequest>();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as AssistanceRequest;
      const id = docSnap.id || data.id;
      if (id) {
        map.set(id, { ...data, id });
      }
    });
    const list = Array.from(map.values());
    callback(list);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, ASSISTANCE_COL);
  });
}

export function subscribeDisasterEvents(callback: (data: DisasterReliefEvent[]) => void) {
  const colRef = collection(db, DISASTER_COL);
  return onSnapshot(colRef, (snapshot) => {
    const map = new Map<string, DisasterReliefEvent>();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as DisasterReliefEvent;
      const id = docSnap.id || data.id;
      if (id) {
        map.set(id, { ...data, id });
      }
    });
    const list = Array.from(map.values());
    callback(list);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, DISASTER_COL);
  });
}

export function subscribeQueueTickets(callback: (data: QueueTicket[]) => void) {
  const colRef = collection(db, QUEUE_COL);
  return onSnapshot(colRef, (snapshot) => {
    const map = new Map<string, QueueTicket>();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as QueueTicket;
      const id = docSnap.id || data.id;
      if (id) {
        map.set(id, { ...data, id });
      }
    });
    const list = Array.from(map.values());
    callback(list);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, QUEUE_COL);
  });
}

export function subscribeReports(callback: (data: SocialCaseStudyReport[]) => void) {
  const colRef = collection(db, REPORTS_COL);
  return onSnapshot(colRef, (snapshot) => {
    const map = new Map<string, SocialCaseStudyReport>();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as SocialCaseStudyReport;
      const id = docSnap.id || data.id;
      if (id) {
        map.set(id, { ...data, id });
      }
    });
    const list = Array.from(map.values());
    callback(list);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, REPORTS_COL);
  });
}

export function subscribeActivityLogs(callback: (data: ActivityLog[]) => void) {
  const colRef = collection(db, LOGS_COL);
  return onSnapshot(colRef, (snapshot) => {
    const map = new Map<string, ActivityLog>();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as ActivityLog;
      const id = docSnap.id || data.id;
      if (id) {
        map.set(id, { ...data, id });
      }
    });
    const list = Array.from(map.values());
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(list);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, LOGS_COL);
  });
}

// Write/Save operations
export async function logActivity(
  action: ActivityLog['action'],
  module: ActivityLog['module'],
  description: string,
  targetId?: string,
  performedBy: string = 'Duty Social Worker'
) {
  try {
    const logId = `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const logEntry: ActivityLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      action,
      module,
      description,
      targetId,
      performedBy,
    };
    const docRef = doc(db, LOGS_COL, logId);
    await setDoc(docRef, logEntry);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, LOGS_COL);
  }
}

export async function saveConstituent(constituent: Constituent, isUpdate = false) {
  try {
    const docRef = doc(db, CONSTITUENTS_COL, constituent.id);
    await setDoc(docRef, constituent, { merge: true });
    await logActivity(
      isUpdate ? 'UPDATE' : 'CREATE',
      'Constituents',
      `${isUpdate ? 'Updated' : 'Registered new'} constituent profile for ${constituent.fullName} (${constituent.barangay})`,
      constituent.id
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, CONSTITUENTS_COL);
  }
}

export async function saveAssistanceRequest(request: AssistanceRequest, isUpdate = false) {
  try {
    const docRef = doc(db, ASSISTANCE_COL, request.id);
    await setDoc(docRef, request, { merge: true });
    await logActivity(
      request.status === 'Disbursed' ? 'DISBURSE' : isUpdate ? 'UPDATE' : 'CREATE',
      'AICS Assistance',
      `${isUpdate ? 'Updated' : 'Processed new'} ${request.assistanceType} for ${request.constituentName} [Status: ${request.status}]`,
      request.id,
      request.socialWorkerAssigned || 'Duty Social Worker'
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, ASSISTANCE_COL);
  }
}

export async function saveDisasterEvent(event: DisasterReliefEvent) {
  try {
    const docRef = doc(db, DISASTER_COL, event.id);
    await setDoc(docRef, event, { merge: true });
    await logActivity(
      'UPDATE',
      'Disaster Relief',
      `Updated DRRM event records for "${event.eventName}"`,
      event.id
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, DISASTER_COL);
  }
}

export async function saveQueueTicket(ticket: QueueTicket) {
  try {
    const docRef = doc(db, QUEUE_COL, ticket.id);
    await setDoc(docRef, ticket, { merge: true });
    await logActivity(
      'UPDATE',
      'Queue',
      `Queue ticket ${ticket.ticketNumber} (${ticket.constituentName}) changed status to ${ticket.status}`,
      ticket.id
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, QUEUE_COL);
  }
}

export async function saveReport(report: SocialCaseStudyReport) {
  try {
    const docRef = doc(db, REPORTS_COL, report.id);
    await setDoc(docRef, report, { merge: true });
    await logActivity(
      'CREATE',
      'Reports',
      `Generated Social Case Study Report (SCSR) for constituent ${report.constituentId}`,
      report.id,
      report.socialWorkerName
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, REPORTS_COL);
  }
}

// Clean and Remove ALL Duplicates across Firestore Database
export async function cleanAndDeduplicateAllData(): Promise<{ deletedCount: number; collectionStats: Record<string, number> }> {
  const collections = [
    { name: CONSTITUENTS_COL, keyFn: (d: any) => d.id || `${d.fullName}_${d.barangay}`.toLowerCase().replace(/\s+/g, '') },
    { name: ASSISTANCE_COL, keyFn: (d: any) => d.id || `${d.constituentName}_${d.dateRequested}`.toLowerCase().replace(/\s+/g, '') },
    { name: DISASTER_COL, keyFn: (d: any) => d.id || `${d.eventName}`.toLowerCase().replace(/\s+/g, '') },
    { name: QUEUE_COL, keyFn: (d: any) => d.id || `${d.ticketNumber}`.toLowerCase().replace(/\s+/g, '') },
    { name: REPORTS_COL, keyFn: (d: any) => d.id || `${d.title}`.toLowerCase().replace(/\s+/g, '') },
    { name: LOGS_COL, keyFn: (d: any) => d.id },
  ];

  let totalDeleted = 0;
  const stats: Record<string, number> = {};

  for (const colDef of collections) {
    try {
      const colRef = collection(db, colDef.name);
      const snapshot = await getDocs(colRef);
      const seenKeys = new Set<string>();
      const batch = writeBatch(db);
      let colDeleted = 0;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const dedupeKey = colDef.keyFn(data) || docSnap.id;

        if (seenKeys.has(dedupeKey)) {
          // Duplicate found! Mark for deletion
          batch.delete(docSnap.ref);
          colDeleted++;
          totalDeleted++;
        } else {
          seenKeys.add(dedupeKey);
        }
      });

      if (colDeleted > 0) {
        await batch.commit();
      }
      stats[colDef.name] = colDeleted;
    } catch (err) {
      console.error(`Error deduplicating collection ${colDef.name}:`, err);
    }
  }

  await logActivity(
    'UPDATE',
    'System',
    `Database sweep completed: Cleaned ${totalDeleted} duplicate record(s) across all collections.`,
    'DB-CLEAN'
  );

  return { deletedCount: totalDeleted, collectionStats: stats };
}

// Clear all collections in database and re-seed
export async function resetAndReseedDatabase() {
  const collections = [CONSTITUENTS_COL, ASSISTANCE_COL, DISASTER_COL, QUEUE_COL, REPORTS_COL, LOGS_COL];
  for (const colName of collections) {
    const colRef = collection(db, colName);
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  }
  await seedInitialDataIfEmpty();
}
