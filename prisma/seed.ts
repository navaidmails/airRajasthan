import { PrismaClient, Role, EnquiryType, EnquiryStatus, ContentStatus, NotificationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting AirRajasthan demo database seeding...");

  // 1. Demo User Accounts from Environment Variables
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@airrajasthan.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "AdminSecurePassword2026!";
  const teamEmail = process.env.SEED_TEAM_EMAIL || "team@airrajasthan.com";
  const teamPassword = process.env.SEED_TEAM_PASSWORD || "TeamSecurePassword2026!";
  const userEmail = process.env.SEED_USER_EMAIL || "client@logistics-partner.com";
  const userPassword = process.env.SEED_USER_PASSWORD || "ClientSecurePassword2026!";

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const teamHash = await bcrypt.hash(teamPassword, 10);
  const userHash = await bcrypt.hash(userPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      passwordHash: adminHash,
      name: "Operations Director (Admin)",
    },
    create: {
      email: adminEmail,
      name: "Operations Director (Admin)",
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });

  const teamUser = await prisma.user.upsert({
    where: { email: teamEmail },
    update: {
      role: Role.TEAM,
      passwordHash: teamHash,
      name: "Cargo Specialist (Team)",
    },
    create: {
      email: teamEmail,
      name: "Cargo Specialist (Team)",
      passwordHash: teamHash,
      role: Role.TEAM,
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      role: Role.USER,
      passwordHash: userHash,
      name: "Rajesh Logistics Pvt Ltd (Client)",
    },
    create: {
      email: userEmail,
      name: "Rajesh Logistics Pvt Ltd (Client)",
      passwordHash: userHash,
      role: Role.USER,
    },
  });

  console.log(`✅ Users seeded: Admin (${adminEmail}), Team (${teamEmail}), Client (${userEmail})`);

  // 2. Page Sections (CMS Content)
  const sections = [
    {
      sectionKey: "home_hero",
      title: "Reliable B2B Air Cargo & Charter Solutions",
      subtitle: "Connecting Western India with Global Trade Corridors",
      content:
        "AirRajasthan provides dedicated scheduled freight, full-charter aircraft, and multimodal cargo consolidation. Engineered for mission-critical supply chains, temperature-sensitive pharma, and oversized industrial project cargo.",
      metaJson: JSON.stringify({
        badge: "B2B Air Cargo Hub • Demo Platform",
        primaryCta: "Request Cargo Quote",
        secondaryCta: "Track Consignment",
        notice: "Draft business overview pending formal operations confirmation.",
      }),
      status: ContentStatus.PUBLISHED,
    },
    {
      sectionKey: "business_benefits",
      title: "Why Logistics Leaders Choose AirRajasthan",
      subtitle: "Engineered for Time-Critical Air Freight Precision",
      content:
        "From cold-chain integrity to high-capacity freighters, our operations bridge regional hubs with international air routes.",
      metaJson: JSON.stringify([
        {
          title: "Regional & Cross-Border Speed",
          description: "Rapid tarmac turnaround at regional gateways avoiding congestion at major mega-hubs.",
        },
        {
          title: "Dedicated Charter Availability",
          description: "Capacity on demand for oversized cargo, automotive components, and oil & gas equipment.",
        },
        {
          title: "End-to-End Visibility",
          description: "Milestone-driven status tracking, proactive airway bill logging, and instant team support.",
        },
        {
          title: "Temperature Controlled Handling",
          description: "Active +15°C to +25°C and +2°C to +8°C cool-chain integrity for pharmaceuticals and perishables.",
        },
      ]),
      status: ContentStatus.PUBLISHED,
    },
    {
      sectionKey: "about_intro",
      title: "Pioneering Strategic Air Cargo Across Rajasthan & Global Corridors",
      subtitle: "AirRajasthan Corporate Profile",
      content:
        "AirRajasthan is conceptualized as an agile air cargo carrier and logistics operator connecting industrial belts across Rajasthan (Jaipur, Jodhpur, Udaipur, Bhiwadi) with major Middle Eastern, European, and Southeast Asian hubs.\n\nNote: All operating routes, fleet allocations, and certifications displayed on this demo portal represent planned draft specifications pending commercial launch.",
      metaJson: JSON.stringify({
        mission: "Deliver high-reliability air cargo connectivity and tailored charters with unwavering speed and compliance.",
        vision: "Establish Rajasthan's most agile air freight bridge linking northern and western India's manufacturing corridors with world trade routes.",
        coreValues: ["Precision Logistics", "Operational Safety", "Total Cargo Integrity", "Transparent Partnership"],
      }),
      status: ContentStatus.PUBLISHED,
    },
    {
      sectionKey: "contact_details",
      title: "Get in Touch with Air Cargo Operations",
      subtitle: "24/7 Air Freight Desk & Charter Inquiries",
      content:
        "Our operations team is available around the clock to address quotation requests, charter charters, and consignment enquiries.",
      metaJson: JSON.stringify({
        headOffice: "Air Cargo Complex, Terminal 1 Cargo Gate, Sanganer, Jaipur, Rajasthan 302029 (Placeholder)",
        phone: "+91 141 289 0000 (Demo Operations Line)",
        email: "cargo@airrajasthan.com (Demo Desk)",
        charterHotline: "+91 9829 000 000 (AOG & Charter Emergency)",
        hours: "24/7 Operations Control Center (OCC)",
      }),
      status: ContentStatus.PUBLISHED,
    },
  ];

  for (const s of sections) {
    await prisma.pageSection.upsert({
      where: { sectionKey: s.sectionKey },
      update: {
        title: s.title,
        subtitle: s.subtitle,
        content: s.content,
        metaJson: s.metaJson,
        status: s.status,
        updatedBy: adminUser.id,
      },
      create: {
        sectionKey: s.sectionKey,
        title: s.title,
        subtitle: s.subtitle,
        content: s.content,
        metaJson: s.metaJson,
        status: s.status,
        updatedBy: adminUser.id,
      },
    });
  }
  console.log("✅ Page sections seeded.");

  // 3. Services (Draft offerings pending confirmation)
  const services = [
    {
      slug: "air-freight",
      title: "Scheduled Air Freight",
      shortDescription: "Reliable airport-to-airport scheduled cargo services connecting regional trade corridors.",
      fullDescription:
        "Our scheduled air freight service delivers consistent capacity and predictable schedules between northern India and international freight gateways. Designed for freight forwarders, manufacturers, and 3PL providers needing dependable allocations.\n\n*Draft offering: Flight schedules and route pairs represent planned operations.*",
      featuresJson: JSON.stringify([
        "Guaranteed space allocations on regular cargo lanes",
        "Palletized and containerized Unit Load Device (ULD) handling",
        "Harmonized customs clearance facilitation",
        "Specialized general cargo and high-value freight security",
      ]),
      icon: "Plane",
      imageUrl: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80",
      order: 1,
      status: ContentStatus.PUBLISHED,
    },
    {
      slug: "cargo-charter",
      title: "Full & Part Cargo Charter",
      shortDescription: "Dedicated aircraft charter for urgent, oversized, hazardous, or project cargo.",
      fullDescription:
        "When standard commercial schedules cannot meet urgent delivery windows or cargo size limitations, our charter operations deliver tailored aircraft capacity on demand. From narrow-body freighters to heavy-lift aircraft, we coordinate flight permissions, ramp operations, and rapid dispatch.\n\n*Draft offering: Charter availability subject to regulatory permissions and fleet leasing agreements.*",
      featuresJson: JSON.stringify([
        "Point-to-point bespoke flight routing",
        "Heavy and outsized equipment transport (AOG, oil & gas, defense spares)",
        "Dedicated ramp supervision and loadmaster coordination",
        "Fast-track overflight and landing slot clearance",
      ]),
      icon: "ShieldAlert",
      imageUrl: "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1200&q=80",
      order: 2,
      status: ContentStatus.PUBLISHED,
    },
    {
      slug: "cargo-consolidation",
      title: "Multimodal Cargo Consolidation",
      shortDescription: "Cost-effective hub consolidation combining road feeder services with air uplift.",
      fullDescription:
        "Optimize freight economics through combined regional bonded trucking and scheduled air consolidation. Shipments from Jaipur, Jodhpur, and Udaipur are batched at regional bonded warehouses and moved seamlessly under single documentation.\n\n*Draft offering: Bonded corridor operations subject to customs authority notifications.*",
      featuresJson: JSON.stringify([
        "Bonded trucking network (Road Feeder Service - RFS)",
        "Consolidated master airway bill (MAWB/HAWB) management",
        "Secure cross-docking and container stuffing",
        "Reduced volumetric rates for medium-density shipments",
      ]),
      icon: "Boxes",
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      order: 3,
      status: ContentStatus.PUBLISHED,
    },
    {
      slug: "pharma-cold-chain",
      title: "Pharma & Perishable Cold Chain",
      shortDescription: "GDP-compliant temperature-controlled air transport for healthcare and agricultural exports.",
      fullDescription:
        "Rajasthan's pharmaceutical manufacturers and agricultural exporters require unbroken cold-chain logistics. We provide active and passive thermal protection throughout tarmac transfers and flight segments.\n\n*Draft offering: Cold-chain storage specs are modeled after WHO GDP guidelines.*",
      featuresJson: JSON.stringify([
        "Active temperature control (+2°C to +8°C, +15°C to +25°C, -20°C deep frozen)",
        "Envirotainer & thermal blanket pre-conditioning",
        "Direct tarmac apron transfer minimizing ambient exposure",
        "Real-time continuous temperature and humidity data logging",
      ]),
      icon: "ThermometerSnowflake",
      imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
      order: 4,
      status: ContentStatus.PUBLISHED,
    },
  ];

  for (const s of services) {
    await prisma.serviceItem.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        shortDescription: s.shortDescription,
        fullDescription: s.fullDescription,
        featuresJson: s.featuresJson,
        icon: s.icon,
        imageUrl: s.imageUrl,
        order: s.order,
        status: s.status,
        updatedBy: adminUser.id,
      },
      create: {
        slug: s.slug,
        title: s.title,
        shortDescription: s.shortDescription,
        fullDescription: s.fullDescription,
        featuresJson: s.featuresJson,
        icon: s.icon,
        imageUrl: s.imageUrl,
        order: s.order,
        status: s.status,
        updatedBy: adminUser.id,
      },
    });
  }
  console.log("✅ Services seeded.");

  // 4. Events (Upcoming and Past)
  const events = [
    {
      slug: "global-air-cargo-conclave-2026",
      title: "Global Air Cargo Conclave 2026 - Dubai Hub",
      summary: "AirRajasthan delegates will present regional cargo corridor models at the annual air freight symposium in Dubai.",
      content:
        "The Global Air Cargo Conclave convenes airlines, freight forwarders, and logistics authorities. AirRajasthan leadership will participate in panel discussions highlighting emerging air corridors in South Asia and the GCC trade corridor.\n\nSession Focus:\n- Cross-border eCommerce and belly cargo optimization\n- Sustainable aviation fuels (SAF) in dedicated freighters\n- Digital airway bills and customs pre-clearance APIs",
      location: "Dubai World Central Aviation City, UAE",
      eventDate: new Date("2026-11-18T09:00:00Z"),
      isPast: false,
      status: ContentStatus.PUBLISHED,
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "india-middle-east-cargo-summit-2026",
      title: "India-Middle East Cargo Gateway Summit - Jaipur",
      summary: "A regional stakeholder conference uniting exporters, customs brokers, and cargo operators.",
      content:
        "Hosted at Jaipur, this summit examines expanding regional air freight capacity for gems, jewellery, textiles, and handicraft export industries in Rajasthan seeking direct global connectivity.",
      location: "Jaipur International Exhibition & Convention Centre (JECC), Sitapura, Jaipur",
      eventDate: new Date("2026-12-05T10:00:00Z"),
      isPast: false,
      status: ContentStatus.PUBLISHED,
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "aviation-logistics-expo-2025",
      title: "Aviation Logistics India Expo 2025",
      summary: "AirRajasthan conceptual prototype showcased to air cargo network partners in Mumbai.",
      content:
        "Our team demonstrated preliminary route studies and feeder connectivity blueprints for Tier-2 airport integration into national air cargo grids.",
      location: "Bandra Kurla Complex (BKC), Mumbai",
      eventDate: new Date("2025-09-14T09:00:00Z"),
      isPast: true,
      status: ContentStatus.PUBLISHED,
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  for (const ev of events) {
    await prisma.eventItem.upsert({
      where: { slug: ev.slug },
      update: {
        title: ev.title,
        summary: ev.summary,
        content: ev.content,
        location: ev.location,
        eventDate: ev.eventDate,
        isPast: ev.isPast,
        status: ev.status,
        imageUrl: ev.imageUrl,
        updatedBy: adminUser.id,
      },
      create: {
        slug: ev.slug,
        title: ev.title,
        summary: ev.summary,
        content: ev.content,
        location: ev.location,
        eventDate: ev.eventDate,
        isPast: ev.isPast,
        status: ev.status,
        imageUrl: ev.imageUrl,
        updatedBy: adminUser.id,
      },
    });
  }
  console.log("✅ Events seeded.");

  // 5. Categorized Gallery Items
  const galleryItems = [
    {
      title: "Boeing 737-800BCF Freighter Concept",
      category: "AIRCRAFT",
      imageUrl: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=400&q=80",
      altText: "Air cargo freighter on tarmac preparing for loading",
      description: "Proposed narrow-body freighter configuration for high-frequency regional corridors.",
      order: 1,
      status: ContentStatus.PUBLISHED,
    },
    {
      title: "Main Deck Cargo Pallet Loading",
      category: "OPERATIONS",
      imageUrl: "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=400&q=80",
      altText: "High loader lifting ULD cargo pallet into freighter main cargo door",
      description: "Tarmac high-loader ramp transfer for standard LD3 and main-deck pallets.",
      order: 2,
      status: ContentStatus.PUBLISHED,
    },
    {
      title: "Bonded Air Cargo Logistics Warehouse",
      category: "WAREHOUSE",
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80",
      altText: "High bay industrial logistics warehouse with automated sorting",
      description: "Airside transit shed with customs screening and automated racking.",
      order: 3,
      status: ContentStatus.PUBLISHED,
    },
    {
      title: "GDP Certified Cold Chain Unit Load Device",
      category: "COLD_CHAIN",
      imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80",
      altText: "Active temperature controlled pharma container unit",
      description: "Active temperature-controlled containers maintain constant +2°C to +8°C.",
      order: 4,
      status: ContentStatus.PUBLISHED,
    },
    {
      title: "Apron Night Operations & Refueling",
      category: "OPERATIONS",
      imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=400&q=80",
      altText: "Aviation ground crew servicing freighter under floodlights",
      description: "24/7 night cargo flights turnaround under high-efficiency apron floodlighting.",
      order: 5,
      status: ContentStatus.PUBLISHED,
    },
    {
      title: "Charter Project Cargo Loading",
      category: "CHARTER",
      imageUrl: "https://images.unsplash.com/photo-1519074069444-1ba4ea16e87b?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1519074069444-1ba4ea16e87b?auto=format&fit=crop&w=400&q=80",
      altText: "Heavy machinery secured inside heavy freighter fuselage",
      description: "Specialized loadmaster securing high-density outsized industrial turbine.",
      order: 6,
      status: ContentStatus.PUBLISHED,
    },
  ];

  for (const g of galleryItems) {
    const existing = await prisma.galleryItem.findFirst({ where: { title: g.title } });
    if (!existing) {
      await prisma.galleryItem.create({
        data: {
          ...g,
          updatedBy: adminUser.id,
        },
      });
    }
  }
  console.log("✅ Gallery seeded.");

  // 6. Enquiries with Complete Workflow Stages
  // Workflow: NEW → ASSIGNED → IN_PROGRESS → AWAITING_CUSTOMER → CLOSED
  const enqData = [
    {
      reference: "AR-ENQ-202610-101",
      type: EnquiryType.QUOTATION,
      status: EnquiryStatus.NEW,
      name: "Amitabh Sen",
      company: "Apex Global Forwarders",
      email: "amitabh@apexforwarding.example",
      phone: "+91 98111 22334",
      serviceName: "Scheduled Air Freight",
      origin: "JAI (Jaipur)",
      destination: "DXB (Dubai International)",
      cargoDescription: "Handicrafts & Sterling Silver Jewelry in reinforced wooden cases",
      weight: 1250,
      weightUnit: "KG",
      pieces: 18,
      message: "Need urgent quotation for weekly scheduled lift starting next Tuesday. Are ULD allocations guaranteed?",
      createdAt: new Date(Date.now() - 3600 * 1000 * 2), // 2 hours ago
    },
    {
      reference: "AR-ENQ-202610-102",
      type: EnquiryType.CHARTER,
      status: EnquiryStatus.ASSIGNED,
      name: "Meera Singhania",
      company: "Rajasthan Solar Power Components",
      email: "logistics@singhaniasolar.example",
      phone: "+91 99200 44556",
      serviceName: "Full & Part Cargo Charter",
      origin: "DEL (Delhi)",
      destination: "FRA (Frankfurt Main)",
      cargoDescription: "High-spec photovoltaic inverter units and semiconductor assemblies",
      weight: 4800,
      weightUnit: "KG",
      pieces: 6,
      message: "Time-critical delivery window. Project delay penalty applies. Requesting dedicated charter feasibility.",
      assignedToId: teamUser.id,
      createdAt: new Date(Date.now() - 3600 * 1000 * 14),
    },
    {
      reference: "AR-ENQ-202610-103",
      type: EnquiryType.PHARMA,
      status: EnquiryStatus.IN_PROGRESS,
      name: "Dr. Vikram Sethi",
      company: "Aristo Lifesciences Jaipur",
      email: "v.sethi@aristolife.example",
      phone: "+91 98290 77889",
      serviceName: "Pharma & Perishable Cold Chain",
      origin: "JAI (Jaipur)",
      destination: "LHR (London Heathrow)",
      cargoDescription: "Injectable vaccines requiring unbroken +2°C to +8°C passive Envirotainer packaging",
      weight: 850,
      weightUnit: "KG",
      pieces: 4,
      message: "Requires pre-conditioned ULD containers with continuous datalogger calibration.",
      assignedToId: teamUser.id,
      createdAt: new Date(Date.now() - 3600 * 1000 * 28),
    },
    {
      reference: "AR-ENQ-202610-104",
      type: EnquiryType.QUOTATION,
      status: EnquiryStatus.AWAITING_CUSTOMER,
      name: "Rajesh Sharma",
      company: "Rajesh Logistics Pvt Ltd",
      email: customerUser.email,
      phone: "+91 98280 12345",
      serviceName: "Multimodal Cargo Consolidation",
      origin: "Jodhpur ICD",
      destination: "SIN (Singapore Changi)",
      cargoDescription: "Textile and artisanal block-printed garments",
      weight: 3200,
      weightUnit: "KG",
      pieces: 45,
      message: "Seeking multimodal consolidation via Jaipur feeder to direct flight to Singapore.",
      customerId: customerUser.id,
      assignedToId: teamUser.id,
      createdAt: new Date(Date.now() - 3600 * 1000 * 48),
    },
    {
      reference: "AR-ENQ-202610-105",
      type: EnquiryType.GENERAL,
      status: EnquiryStatus.CLOSED,
      name: "Sunil Kothari",
      company: "Marwar Marbles & Stoneworks",
      email: "skothari@marwarstones.example",
      phone: "+91 94140 55667",
      serviceName: "Scheduled Air Freight",
      origin: "UDR (Udaipur)",
      destination: "DOH (Doha Hamad)",
      cargoDescription: "Polished carved architectural sandstone prototypes",
      weight: 620,
      weightUnit: "KG",
      pieces: 3,
      message: "Urgent architectural exhibition samples delivered under customs ATA Carnet.",
      assignedToId: adminUser.id,
      createdAt: new Date(Date.now() - 3600 * 1000 * 96),
    },
  ];

  for (const item of enqData) {
    const enq = await prisma.enquiry.upsert({
      where: { reference: item.reference },
      update: {},
      create: {
        reference: item.reference,
        type: item.type,
        status: item.status,
        name: item.name,
        company: item.company,
        email: item.email,
        phone: item.phone,
        serviceName: item.serviceName,
        origin: item.origin,
        destination: item.destination,
        cargoDescription: item.cargoDescription,
        weight: item.weight,
        weightUnit: item.weightUnit,
        pieces: item.pieces,
        message: item.message,
        customerId: item.customerId,
        assignedToId: item.assignedToId,
        createdAt: item.createdAt,
      },
    });

    // Seed activity log for each
    await prisma.activityLog.create({
      data: {
        enquiryId: enq.id,
        action: "ENQUIRY_CREATED",
        details: `Enquiry submitted with reference ${enq.reference}`,
        createdAt: enq.createdAt,
      },
    });

    if (enq.status === EnquiryStatus.ASSIGNED || enq.status === EnquiryStatus.IN_PROGRESS || enq.status === EnquiryStatus.AWAITING_CUSTOMER) {
      await prisma.activityLog.create({
        data: {
          enquiryId: enq.id,
          userId: teamUser.id,
          action: "ASSIGNED",
          details: `Assigned to ${teamUser.name}`,
          createdAt: new Date(enq.createdAt.getTime() + 1000 * 60 * 30),
        },
      });
    }

    // Add internal notes to IN_PROGRESS enquiry (Must NEVER be visible to customer!)
    if (enq.reference === "AR-ENQ-202610-103") {
      await prisma.enquiryNote.create({
        data: {
          enquiryId: enq.id,
          authorId: teamUser.id,
          authorName: teamUser.name,
          note: "INTERNAL NOTE: Verified cold room slot at DEL apron. Dry-ice replenishment kit reserved with ground handling partner.",
          createdAt: new Date(enq.createdAt.getTime() + 1000 * 60 * 60),
        },
      });
    }

    // Add customer-visible reply to AWAITING_CUSTOMER enquiry
    if (enq.reference === "AR-ENQ-202610-104") {
      // Internal note
      await prisma.enquiryNote.create({
        data: {
          enquiryId: enq.id,
          authorId: teamUser.id,
          authorName: teamUser.name,
          note: "INTERNAL NOTE: Singapore SQ freighter space checked. Volumetric ratio needs verification before final rate issuance.",
          createdAt: new Date(enq.createdAt.getTime() + 1000 * 60 * 45),
        },
      });
      // Customer visible reply
      await prisma.enquiryReply.create({
        data: {
          enquiryId: enq.id,
          authorId: teamUser.id,
          authorName: teamUser.name,
          isFromCustomer: false,
          message:
            "Dear Rajesh Logistics Team,\n\nThank you for your enquiry. We can accommodate the 3,200 KG consolidation via our Jaipur feeder hub connecting to flight AR-881. Could you kindly share carton outer dimensions (L x W x H in cm) so we can calculate the volumetric weight and lock in the final rate?\n\nBest regards,\nAirRajasthan Cargo Desk",
          createdAt: new Date(enq.createdAt.getTime() + 1000 * 60 * 90),
        },
      });
    }

    // Closed enquiry activities
    if (enq.reference === "AR-ENQ-202610-105") {
      await prisma.enquiryReply.create({
        data: {
          enquiryId: enq.id,
          authorId: adminUser.id,
          authorName: adminUser.name,
          isFromCustomer: false,
          message:
            "Dear Mr. Kothari,\n\nQuotation Q-2026-904 for 620 KG exhibition cargo accepted and booked under MAWB 612-4412-8901. Thank you for partnering with AirRajasthan.",
          createdAt: new Date(enq.createdAt.getTime() + 1000 * 60 * 120),
        },
      });
      await prisma.activityLog.create({
        data: {
          enquiryId: enq.id,
          userId: adminUser.id,
          action: "STATUS_CHANGED",
          details: "Status changed to CLOSED after booking confirmation.",
          createdAt: new Date(enq.createdAt.getTime() + 1000 * 60 * 180),
        },
      });
    }
  }
  console.log("✅ Enquiries & workflow stages seeded.");

  // 7. Notification Job (Outbox pattern demonstration with safe "NOT_CONFIGURED" status)
  await prisma.notificationJob.create({
    data: {
      channel: "EMAIL",
      recipient: "amitabh@apexforwarding.example",
      subject: "Acknowledgment: Enquiry Received [AR-ENQ-202610-101]",
      content: "Your quotation request for Scheduled Air Freight has been logged. Our air cargo team is reviewing specifications.",
      status: NotificationStatus.NOT_CONFIGURED,
      errorDetails: "Demo environment: SMTP provider not configured. Notification preserved in persistent outbox.",
    },
  });
  console.log("✅ Outbox notification job logged.");

  console.log("🚀 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
