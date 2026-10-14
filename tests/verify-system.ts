import { AuthService } from "../src/features/authentication/auth-service";
import { EnquiryService } from "../src/features/enquiries/enquiry-service";
import { ContentService } from "../src/features/content/content-service";
import { ServiceCatalog } from "../src/features/services/service-catalog";
import { TrackingService } from "../src/features/tracking/tracking-provider";
import { prisma } from "../src/lib/prisma";
import { Role, EnquiryStatus, ContentStatus } from "@prisma/client";

async function runTests() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("✈️  AIRRAJASTHAN SYSTEM VERIFICATION & SMOKE TEST SUITE");
  console.log("═══════════════════════════════════════════════════════════\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST GROUP 1: HTTP Web Pages & API Endpoints
  // -------------------------------------------------------------
  console.log("🌐 1. TESTING HTTP ENDPOINTS ON PRODUCTION SERVER (http://localhost:3000)");

  const routesToTest = [
    { url: "/", expected: 200, label: "Home Page" },
    { url: "/about", expected: 200, label: "About Page" },
    { url: "/services", expected: 200, label: "Services Listing" },
    { url: "/services/air-freight", expected: 200, label: "Service Detail: Scheduled Air Freight" },
    { url: "/gallery", expected: 200, label: "Visual Gallery" },
    { url: "/events", expected: 200, label: "Industry Events" },
    { url: "/events/global-air-cargo-conclave-2026", expected: 200, label: "Event Detail: Dubai Conclave" },
    { url: "/contact", expected: 200, label: "Contact Operations" },
    { url: "/query", expected: 200, label: "Request a Quote Form" },
    { url: "/tracking", expected: 200, label: "Cargo Tracking Console" },
    { url: "/login", expected: 200, label: "Login Portal" },
    { url: "/register", expected: 200, label: "Client Registration" },
    { url: "/invalid-waypoint-route-404", expected: 404, label: "404 Not Found Page" },
  ];

  for (const r of routesToTest) {
    try {
      const res = await fetch(`http://localhost:3000${r.url}`);
      assert(res.status === r.expected, `${r.label} returns HTTP ${r.expected} (Got ${res.status})`);
    } catch (err: any) {
      assert(false, `${r.label} reachable: ${err.message}`);
    }
  }

  // -------------------------------------------------------------
  // TEST GROUP 2: Live Tracking API Engine & Milestones
  // -------------------------------------------------------------
  console.log("\n📦 2. TESTING TRACKING ENGINE & DECUPLED PROVIDER");

  // Known sample shipment
  const trackRes1 = await fetch("http://localhost:3000/api/tracking?ref=AR-7842-DEL");
  const trackData1 = await trackRes1.json();
  assert(
    trackRes1.status === 200 && trackData1.found === true && trackData1.shipment?.flightNumber === "AR-881 Cargo",
    "Sample AWB 'AR-7842-DEL' successfully tracked with flight details and equipment"
  );
  assert(
    trackData1.shipment?.milestones?.length >= 5,
    `Sample shipment contains full milestone trajectory (${trackData1.shipment?.milestones?.length} milestones)`
  );

  // Unknown shipment
  const trackRes2 = await fetch("http://localhost:3000/api/tracking?ref=UNKNOWN-AWB-999");
  const trackData2 = await trackRes2.json();
  assert(
    trackRes2.status === 200 && trackData2.found === false && trackData2.message.includes("No demo shipment found"),
    "Unknown AWB reference returns 'No demo shipment found' with simulation guidance"
  );

  // Missing parameter
  const trackRes3 = await fetch("http://localhost:3000/api/tracking");
  assert(trackRes3.status === 400, "Tracking API rejects request missing reference query parameter with 400");

  // -------------------------------------------------------------
  // TEST GROUP 3: Authentication & Role Enforcement
  // -------------------------------------------------------------
  console.log("\n🔐 3. TESTING AUTHENTICATION & ROLE-BASED ACCESS CONTROL");

  // Admin login
  const adminLogin = await AuthService.login({
    email: "admin@airrajasthan.com",
    password: "AdminSecurePassword2026!",
  });
  assert(
    adminLogin.success && adminLogin.session?.role === Role.ADMIN,
    "Admin authentication succeeds with role ADMIN"
  );

  // Team login
  const teamLogin = await AuthService.login({
    email: "team@airrajasthan.com",
    password: "TeamSecurePassword2026!",
  });
  assert(
    teamLogin.success && teamLogin.session?.role === Role.TEAM,
    "Team specialist authentication succeeds with role TEAM"
  );

  // Client login
  const userLogin = await AuthService.login({
    email: "client@logistics-partner.com",
    password: "ClientSecurePassword2026!",
  });
  assert(
    userLogin.success && userLogin.session?.role === Role.USER,
    "Client forwarder authentication succeeds with role USER"
  );

  // Invalid password
  const badLogin = await AuthService.login({
    email: "admin@airrajasthan.com",
    password: "WrongPassword!",
  });
  assert(!badLogin.success, "Invalid credentials rejected with error message");

  // Public registration role safety check: must always be USER
  const testRegEmail = `test.shipper.${Date.now()}@example.com`;
  const regResult = await AuthService.register({
    name: "New Tested Forwarder",
    email: testRegEmail,
    password: "SecureShipperPass2026!",
    confirmPassword: "SecureShipperPass2026!",
  });
  assert(
    regResult.success && regResult.session?.role === Role.USER,
    "Public registration forces Role.USER regardless of client environment"
  );

  // -------------------------------------------------------------
  // TEST GROUP 4: Enquiry Persistence & Workflow State Machine
  // -------------------------------------------------------------
  console.log("\n📋 4. TESTING ENQUIRY WORKFLOW & STRICT PRIVACY BOUNDARIES");

  // Create new enquiry
  const enqInput = {
    name: "Alok Industries Ltd",
    company: "Alok Textile Logistics",
    email: "logistics@alokindustries.example",
    phone: "+91 98200 88990",
    serviceName: "Scheduled Air Freight",
    origin: "JAI (Jaipur)",
    destination: "FRA (Frankfurt)",
    cargoDescription: "Finished high-thread-count textiles",
    weight: 2200,
    weightUnit: "KG" as const,
    pieces: 25,
    message: "Requesting rate per kg for twice-weekly palletized lift to Frankfurt.",
    type: "QUOTATION" as any,
  };

  const newEnq = await EnquiryService.createEnquiry(enqInput, null);
  assert(
    newEnq.success && newEnq.reference.startsWith("AR-"),
    `Guest quotation enquiry created with reference: ${newEnq.reference}`
  );

  // Verify persistence in MySQL
  const dbEnq = await prisma.enquiry.findUnique({ where: { id: newEnq.id } });
  assert(
    dbEnq !== null && dbEnq.status === EnquiryStatus.NEW,
    "Enquiry persisted directly in MySQL with initial status NEW"
  );

  // Verify Outbox Notification job
  const outboxJob = await prisma.notificationJob.findFirst({
    where: { recipient: enqInput.email },
  });
  assert(
    outboxJob !== null && outboxJob.status === "NOT_CONFIGURED",
    "Outbox pattern: notification job saved to database with NOT_CONFIGURED demo status"
  );

  // Duplicate submission protection
  let duplicateCaught = false;
  try {
    await EnquiryService.createEnquiry(enqInput, null);
  } catch (err: any) {
    if (err.message.includes("Duplicate enquiry detected")) duplicateCaught = true;
  }
  assert(duplicateCaught, "Duplicate submission protection: Rapid identical submission rejected");

  // Workflow Progression: Status Update (NEW -> ASSIGNED -> IN_PROGRESS -> AWAITING_CUSTOMER -> CLOSED)
  if (teamLogin.session && newEnq.id) {
    // 1. Assign to Team Member
    const assigned = await EnquiryService.assignEnquiry(teamLogin.session, newEnq.id, teamLogin.session.userId);
    assert(
      assigned.status === EnquiryStatus.ASSIGNED && assigned.assignedToId === teamLogin.session.userId,
      "Workflow transition: Status updated to ASSIGNED with team specialist allocation"
    );

    // 2. Add confidential internal note
    const note = await EnquiryService.addInternalNote(
      teamLogin.session,
      newEnq.id,
      "OCC Ramp note: Special high-loader pallet required for Jaipur bay 3."
    );
    assert(note.id !== undefined, "Internal confidential note successfully saved by Team member");

    // 3. Privacy boundary check: Regular Customer MUST NOT see internal notes!
    if (userLogin.session) {
      // Create enquiry owned by client
      const clientEnq = await EnquiryService.createEnquiry(
        {
          ...enqInput,
          email: userLogin.session.email,
          message: "Confidential privacy check query for Rajesh Logistics.",
        },
        userLogin.session
      );

      // Add an internal note to client's enquiry
      await EnquiryService.addInternalNote(
        teamLogin.session,
        clientEnq.id,
        "SECRET INTERNAL PRICING: Profit margin 18%, competitor matched at 15%."
      );

      // Customer fetches their own enquiry
      const customerView = await EnquiryService.getEnquiryById(userLogin.session, clientEnq.id);
      assert(
        (customerView as any).notes === undefined || (customerView as any).notes === false,
        "SECURITY VERIFIED: Internal notes are completely omitted from Customer API responses"
      );

      // Customer tries to fetch someone else's enquiry
      let unauthorizedAccessBlocked = false;
      try {
        await EnquiryService.getEnquiryById(userLogin.session, newEnq.id);
      } catch (err: any) {
        if (err.message.includes("FORBIDDEN")) unauthorizedAccessBlocked = true;
      }
      assert(
        unauthorizedAccessBlocked,
        "SECURITY VERIFIED: Customer cannot access other customers' or guest enquiry records"
      );
    }

    // 4. Team posts customer reply
    const reply = await EnquiryService.addReply(
      teamLogin.session,
      newEnq.id,
      "Quotation ready: $2.40/kg all-in including Jaipur screening and ramp handling."
    );
    const updatedEnq = await prisma.enquiry.findUnique({ where: { id: newEnq.id } });
    assert(
      reply.id !== undefined && updatedEnq?.status === EnquiryStatus.AWAITING_CUSTOMER,
      "Customer reply posted and status automatically updated to AWAITING_CUSTOMER"
    );

    // 5. Close enquiry
    const closed = await EnquiryService.updateStatus(teamLogin.session, newEnq.id, EnquiryStatus.CLOSED);
    assert(closed.status === EnquiryStatus.CLOSED, "Workflow transition: Status closed successfully");

    // Verify Audit log history
    const auditLogs = await prisma.activityLog.findMany({ where: { enquiryId: newEnq.id } });
    assert(
      auditLogs.length >= 4,
      `Full activity audit trail logged (${auditLogs.length} audit entries created)`
    );
  }

  // -------------------------------------------------------------
  // TEST GROUP 5: CMS Content Management & Role Guard
  // -------------------------------------------------------------
  console.log("\n📝 5. TESTING CMS CONTENT CONTROLS & PUBLISHING PERMISSIONS");

  if (teamLogin.session && adminLogin.session) {
    // Team member updates draft
    const teamDraft = await ContentService.updateSection(teamLogin.session, "home_hero", {
      title: "Reliable B2B Air Cargo & Charter Solutions",
      subtitle: "Connecting Western India with Global Trade Corridors",
      content: "Updated draft description for operations testing.",
      status: ContentStatus.DRAFT,
    });
    assert(
      teamDraft.status === ContentStatus.DRAFT,
      "Team member saves page section as DRAFT"
    );

    // Team member attempts to publish directly -> Must be rejected
    let teamPublishBlocked = false;
    try {
      await ContentService.publishSection(teamLogin.session, "home_hero");
    } catch (err: any) {
      if (err.message.includes("FORBIDDEN")) teamPublishBlocked = true;
    }
    assert(
      teamPublishBlocked,
      "SECURITY VERIFIED: Team member cannot publish live content directly (ADMIN required)"
    );

    // Admin publishes live section
    const published = await ContentService.publishSection(adminLogin.session, "home_hero");
    assert(
      published.status === ContentStatus.PUBLISHED,
      "Administrator publishes section live with cache revalidation"
    );

    // Admin updates role
    const updatedRole = await AuthService.updateRole(adminLogin.session, regResult.session!.userId, Role.TEAM);
    assert(
      updatedRole.role === Role.TEAM,
      "Administrator updates user role to TEAM"
    );

    // Admin self-downgrade prevention check
    let selfDowngradeBlocked = false;
    try {
      await AuthService.updateRole(adminLogin.session, adminLogin.session.userId, Role.USER);
    } catch (err: any) {
      if (err.message.includes("cannot remove Administrator rights from your own account")) {
        selfDowngradeBlocked = true;
      }
    }
    assert(
      selfDowngradeBlocked,
      "SECURITY VERIFIED: Administrator cannot accidentally revoke their own admin rights"
    );
  }

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED | TOTAL: ${passed + failed}`);
  console.log("═══════════════════════════════════════════════════════════\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error("Unhandled test failure:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
