import { shipments as demoShipments } from '../data/tradeData';
import { serviceCatalog } from '../data/serviceCatalog';
import { hasSupabase, supabase } from './supabaseClient';

const resolveCompanyName = (companies) =>
  Array.isArray(companies)
    ? companies[0]?.company_name || ''
    : companies?.company_name || '';

const demoCompany = {
  id: 'demo-company',
  companyName: 'Abdullah Ventures',
  contactName: 'Partner Operations Team',
  email: 'mdsalmantd5@gmail.com',
  region: 'Bangladesh',
  status: 'Active',
};

const demoServiceRequests = [
  {
    id: 'demo-request-1',
    companyId: demoCompany.id,
    companyName: demoCompany.companyName,
    requesterName: demoCompany.contactName,
    requesterEmail: demoCompany.email,
    contactNumber: '+8801700000001',
    serviceName: serviceCatalog[0],
    details: 'Prepare regulator filing pack and liaison support for import permits.',
    status: 'IN_PROGRESS',
    progressPercent: 65,
    createdAt: '2026-04-02T08:00:00Z',
    updatedAt: '2026-04-08T10:15:00Z',
    completedAt: null,
    adminNote: 'Regulator checklist shared. Waiting for one final ownership document.',
  },
  {
    id: 'demo-request-2',
    companyId: demoCompany.id,
    companyName: demoCompany.companyName,
    requesterName: demoCompany.contactName,
    requesterEmail: demoCompany.email,
    contactNumber: '+8801700000002',
    serviceName: serviceCatalog[5],
    details: 'Need support to onboard an initial operations team for Q2 launch.',
    status: 'REQUESTED',
    progressPercent: 20,
    createdAt: '2026-04-06T14:30:00Z',
    updatedAt: '2026-04-06T14:30:00Z',
    completedAt: null,
    adminNote: '',
  },
];

const mapServiceRequests = (requests = []) =>
  requests.map((request) => ({
    id: request.id,
    companyId: request.company_id || request.companyId || '',
    companyName: resolveCompanyName(request.companies) || request.companyName || '',
    requesterName: request.requester_name || request.requesterName || 'Not specified',
    requesterEmail: request.requester_email || request.requesterEmail || '',
    contactNumber: request.contact_number || request.contactNumber || '',
    serviceName: request.service_name || request.serviceName,
    details: request.service_details || request.details || '',
    status: request.status || 'REQUESTED',
    progressPercent: Number(request.progress_percent ?? request.progressPercent ?? 0),
    createdAt: request.created_at || request.createdAt || null,
    updatedAt: request.updated_at || request.updatedAt || null,
    completedAt: request.completed_at || request.completedAt || null,
    adminNote: request.admin_note || request.adminNote || '',
  }));

const mapShipments = (shipments = []) =>
  shipments.map((shipment) => ({
    id: shipment.id || shipment.tracking_id,
    trackingId: shipment.tracking_id || shipment.id,
    origin: shipment.origin_port || shipment.origin,
    destination: shipment.destination_port || shipment.destination || 'Dhaka, Bangladesh',
    cargoType: shipment.cargo_type || shipment.cargoType || 'General Cargo',
    status: shipment.status,
    eta: shipment.eta_delivery || shipment.eta,
  }));

const buildStats = (shipments = []) => {
  const totalShipments = shipments.length;
  const deliveredShipments = shipments.filter((item) => item.status === 'DELIVERED').length;
  const ports = new Set(shipments.flatMap((item) => [item.origin, item.destination].filter(Boolean)));

  return [
    { label: 'Shipments', value: `${totalShipments}` },
    { label: 'Delivered', value: `${deliveredShipments}` },
    { label: 'Trade Routes', value: `${ports.size}` },
  ];
};

const createSnapshot = (company, shipments) => {
  const mappedShipments = mapShipments(shipments);

  return {
    company,
    shipments: mappedShipments,
    stats: buildStats(mappedShipments),
  };
};

const resolveFallbackCompanyId = async () => {
  if (!hasSupabase) {
    return demoCompany.id;
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.NEXT_PUBLIC_PARTNER_DEMO_EMAIL || '';

  if (adminEmail) {
    const { data: adminCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('contact_email', adminEmail)
      .maybeSingle();

    if (adminCompany?.id) {
      return adminCompany.id;
    }
  }

  const { data: firstCompany } = await supabase
    .from('companies')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  return firstCompany?.id || '';
};

const upsertPortalUserProfile = async ({
  email,
  fullName = '',
  contactNumber = '',
  addressLine = '',
  city = '',
  country = '',
  companyName = '',
  notes = '',
}) => {
  if (!hasSupabase || !email) {
    return;
  }

  const { error } = await supabase.from('portal_user_profiles').upsert(
    {
      email,
      full_name: fullName || null,
      contact_number: contactNumber || null,
      address_line: addressLine || null,
      city: city || null,
      country: country || null,
      company_name: companyName || null,
      notes: notes || null,
    },
    { onConflict: 'email' }
  );

  if (error) {
    throw error;
  }
};

export const savePortalUserProfile = async (payload) => {
  const normalizedEmail = (payload?.email || '').trim();

  if (!normalizedEmail) {
    throw new Error('Email is required to save profile details.');
  }

  if (!hasSupabase) {
    return { ok: true, mode: 'demo' };
  }

  await upsertPortalUserProfile({
    email: normalizedEmail,
    fullName: payload.fullName,
    contactNumber: payload.contactNumber,
    addressLine: payload.addressLine,
    city: payload.city,
    country: payload.country,
    companyName: payload.companyName,
    notes: payload.notes,
  });

  return { ok: true, mode: 'supabase' };
};

export const getPortalSnapshot = async (access) => {
  if (!hasSupabase || !access?.companyId) {
    return createSnapshot(demoCompany, demoShipments);
  }

  try {
    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('id', access.companyId)
      .maybeSingle();

    if (!company) {
      return createSnapshot(demoCompany, demoShipments);
    }

    const { data: shipments } = await supabase
      .from('company_shipments')
      .select('*')
      .eq('company_id', company.id)
      .order('updated_at', { ascending: false });

    return createSnapshot(
      {
        id: company.id,
        companyName: company.company_name,
        contactName: company.contact_name,
        email: company.contact_email,
        region: company.region,
        status: company.status,
      },
      shipments || []
    );
  } catch (error) {
    return createSnapshot(demoCompany, demoShipments);
  }
};

export const subscribeToCompanyData = (companyId, onChange) => {
  if (!hasSupabase || !companyId) {
    return () => {};
  }

  const channel = supabase
    .channel(`company-dashboard-${companyId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'companies', filter: `id=eq.${companyId}` },
      onChange
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'company_shipments', filter: `company_id=eq.${companyId}` },
      onChange
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'company_service_requests', filter: `company_id=eq.${companyId}` },
      onChange
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const submitPartnerApplication = async (applicationPayload) => {
  if (!hasSupabase) {
    return { ok: true, mode: 'demo' };
  }

  const companyInsert = {
    company_name: applicationPayload.companyName,
    contact_name: `${applicationPayload.firstName} ${applicationPayload.lastName}`.trim(),
    contact_email: applicationPayload.email,
    region: applicationPayload.tradeRegion,
    status: 'Pending Review',
  };

  const { data: company, error: companyError } = await supabase
    .from('companies')
    .upsert(companyInsert, { onConflict: 'contact_email' })
    .select()
    .single();

  if (companyError) {
    throw companyError;
  }

  const { error: requestError } = await supabase.from('partnership_requests').insert({
    company_id: company.id,
    company_name: applicationPayload.companyName,
    contact_name: `${applicationPayload.firstName} ${applicationPayload.lastName}`.trim(),
    contact_email: applicationPayload.email,
    region: applicationPayload.tradeRegion,
    notes: applicationPayload.sector || 'General trade partnership request',
    status: 'Pending',
  });

  if (requestError) {
    throw requestError;
  }

  return { ok: true, mode: 'supabase', companyId: company.id };
};

export const getAdminSnapshot = async () => {
  if (!hasSupabase) {
    return {
      companies: [demoCompany],
      shipments: mapShipments(demoShipments),
      serviceRequests: demoServiceRequests,
      users: [
        {
          id: 'demo-user-admin',
          email: demoCompany.email,
          fullName: demoCompany.contactName,
          role: 'admin',
          companyId: demoCompany.id,
          companyName: demoCompany.companyName,
        },
      ],
    };
  }

  throw new Error('Access context is required.');
};

export const getAdminSnapshotForAccess = async (access) => {
  if (!hasSupabase) {
    return getAdminSnapshot();
  }

  const companiesQuery = supabase.from('companies').select('*').order('created_at', { ascending: false });
  const shipmentsQuery = supabase.from('company_shipments').select('*').order('updated_at', { ascending: false });
  const usersQuery = supabase
    .from('company_users')
    .select('id, email, full_name, role, company_id, companies:company_id(company_name)')
    .order('created_at', { ascending: false });
  const serviceRequestsQuery = supabase
    .from('company_service_requests')
    .select(
      'id, company_id, requester_name, requester_email, contact_number, service_name, service_details, status, progress_percent, admin_note, created_at, updated_at, completed_at, companies:company_id(company_name)'
    )
    .order('updated_at', { ascending: false });

  const scopedCompaniesQuery = access?.role === 'super_admin' ? companiesQuery : companiesQuery.eq('id', access.companyId);
  const scopedShipmentsQuery =
    access?.role === 'super_admin' ? shipmentsQuery : shipmentsQuery.eq('company_id', access.companyId);
  const scopedUsersQuery = access?.role === 'super_admin' ? usersQuery : usersQuery.eq('company_id', access.companyId);
  const scopedServiceRequestsQuery =
    access?.role === 'super_admin' ? serviceRequestsQuery : serviceRequestsQuery.eq('company_id', access.companyId);

  const [
    { data: companies, error: companiesError },
    { data: shipments, error: shipmentsError },
    { data: users, error: usersError },
    { data: serviceRequests, error: serviceRequestsError },
  ] = await Promise.all([scopedCompaniesQuery, scopedShipmentsQuery, scopedUsersQuery, scopedServiceRequestsQuery]);

  if (companiesError) {
    throw companiesError;
  }

  if (shipmentsError) {
    throw shipmentsError;
  }

  if (usersError) {
    throw usersError;
  }

  if (serviceRequestsError) {
    throw serviceRequestsError;
  }

  return {
    companies: (companies || []).map((company) => ({
      id: company.id,
      companyName: company.company_name,
      contactName: company.contact_name,
      email: company.contact_email,
      region: company.region,
      status: company.status,
    })),
    shipments: mapShipments(shipments || []).map((shipment) => ({
      ...shipment,
      companyId: (shipments || []).find((item) => item.tracking_id === shipment.trackingId)?.company_id || '',
    })),
    serviceRequests: mapServiceRequests(serviceRequests || []),
    users: (users || []).map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      companyId: user.company_id || '',
      companyName: resolveCompanyName(user.companies) || '',
    })),
  };
};

export const createCompany = async (payload, access) => {
  if (!hasSupabase) {
    return { ok: true, mode: 'demo' };
  }

  if (access?.role !== 'super_admin') {
    throw new Error('Only super admins can create new companies.');
  }

  const { data, error } = await supabase
    .from('companies')
    .insert({
      company_name: payload.companyName,
      contact_name: payload.contactName,
      contact_email: payload.email,
      region: payload.region,
      status: payload.status,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateCompany = async (companyId, payload, access) => {
  if (!hasSupabase) {
    return { ok: true, mode: 'demo' };
  }

  if (access?.role !== 'super_admin' && access?.companyId !== companyId) {
    throw new Error('You can only update your own company.');
  }

  const { data, error } = await supabase
    .from('companies')
    .update({
      company_name: payload.companyName,
      contact_name: payload.contactName,
      contact_email: payload.email,
      region: payload.region,
      status: payload.status,
    })
    .eq('id', companyId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteCompany = async (companyId, access) => {
  if (!hasSupabase) {
    return { ok: true, mode: 'demo' };
  }

  if (access?.role !== 'super_admin') {
    throw new Error('Only super admins can delete companies.');
  }

  const { error } = await supabase.from('companies').delete().eq('id', companyId);

  if (error) {
    throw error;
  }
};

export const createShipment = async (payload, access) => {
  if (!hasSupabase) {
    return { ok: true, mode: 'demo' };
  }

  if (access?.role !== 'super_admin' && access?.companyId !== payload.companyId) {
    throw new Error('You can only create shipments for your own company.');
  }

  const { data, error } = await supabase
    .from('company_shipments')
    .insert({
      company_id: payload.companyId,
      tracking_id: payload.trackingId,
      origin_port: payload.origin,
      destination_port: payload.destination,
      cargo_type: payload.cargoType,
      status: payload.status,
      eta_delivery: payload.eta,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateShipment = async (shipmentId, payload, access) => {
  if (!hasSupabase) {
    return { ok: true, mode: 'demo' };
  }

  if (access?.role !== 'super_admin' && access?.companyId !== payload.companyId) {
    throw new Error('You can only update shipments for your own company.');
  }

  const { data, error } = await supabase
    .from('company_shipments')
    .update({
      company_id: payload.companyId,
      tracking_id: payload.trackingId,
      origin_port: payload.origin,
      destination_port: payload.destination,
      cargo_type: payload.cargoType,
      status: payload.status,
      eta_delivery: payload.eta,
    })
    .eq('id', shipmentId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteShipment = async (shipmentId, access) => {
  if (!hasSupabase) {
    return { ok: true, mode: 'demo' };
  }

  if (access?.role !== 'super_admin' && !access?.companyId) {
    throw new Error('You do not have permission to delete shipments.');
  }

  let query = supabase.from('company_shipments').delete().eq('id', shipmentId);

  if (access?.role !== 'super_admin') {
    query = query.eq('company_id', access.companyId);
  }

  const { error } = await query;

  if (error) {
    throw error;
  }
};

export const getServiceRequestsForAccess = async (access) => {
  if (!hasSupabase) {
    if (access?.role === 'super_admin' || access?.role === 'admin') {
      return demoServiceRequests;
    }

    return demoServiceRequests.filter((request) => request.requesterEmail === access?.email);
  }

  if (!access?.email) {
    return [];
  }

  const role = access?.role || 'user';

  let query = supabase
    .from('company_service_requests')
    .select('id, company_id, requester_name, requester_email, contact_number, service_name, service_details, status, progress_percent, admin_note, created_at, updated_at, completed_at, companies:company_id(company_name)')
    .order('updated_at', { ascending: false });

  if (role === 'super_admin') {
    // Super admins can see all requests.
  } else if (role === 'admin') {
    if (access.companyId) {
      query = query.eq('company_id', access.companyId);
    } else {
      query = query.eq('requester_email', access.email);
    }
  } else {
    query = query.eq('requester_email', access.email);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return mapServiceRequests(data || []);
};

export const createServiceRequest = async (payload, access) => {
  if (!payload.serviceName) {
    throw new Error('Please select a service.');
  }

  if (!hasSupabase) {
    return {
      ...mapServiceRequests([
        {
          companyId: access?.companyId || demoCompany.id,
          requesterName: payload.requesterName || access?.companyName || 'Portal User',
          requesterEmail: access?.email || demoCompany.email,
          contactNumber: payload.contactNumber || '',
          serviceName: payload.serviceName,
          details: payload.details || '',
          status: 'REQUESTED',
          progressPercent: 0,
        },
      ])[0],
      id: `demo-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const requesterEmail = access?.email || payload.requesterEmail || '';

  if (!requesterEmail) {
    throw new Error('A requester email is required before creating requests.');
  }

  const resolvedCompanyId = access?.companyId || (await resolveFallbackCompanyId());

  if (!resolvedCompanyId) {
    throw new Error('No service routing company is configured yet. Please contact support.');
  }

  let profileContactNumber = '';
  if (hasSupabase) {
    const { data: profile } = await supabase
      .from('portal_user_profiles')
      .select('contact_number')
      .eq('email', requesterEmail)
      .maybeSingle();

    profileContactNumber = profile?.contact_number || '';
  }

  const insertPayload = {
    company_id: resolvedCompanyId,
    requester_name: payload.requesterName || access.companyName || 'Portal User',
    requester_email: requesterEmail,
    contact_number: profileContactNumber,
    service_name: payload.serviceName,
    service_details: payload.details || '',
    status: 'REQUESTED',
    progress_percent: 0,
  };

  const { data, error } = await supabase.from('company_service_requests').insert(insertPayload).select().single();

  if (error) {
    throw error;
  }

  return mapServiceRequests([data])[0];
};

export const updateServiceRequestProgress = async (requestId, payload, access) => {
  const nextProgress = Math.max(0, Math.min(100, Number(payload.progressPercent ?? 0)));
  const nextStatus = payload.status || 'REQUESTED';

  if (nextStatus === 'COMPLETED' && nextProgress < 100) {
    throw new Error('Completed requests must have 100% progress.');
  }

  if (nextProgress === 100 && nextStatus !== 'COMPLETED') {
    throw new Error('Use COMPLETED status when progress is 100%.');
  }

  if (access?.role !== 'admin' && access?.role !== 'super_admin') {
    throw new Error('Only admins can update request progress.');
  }

  const updatePayload = {
    status: nextStatus,
    progress_percent: nextProgress,
    admin_note: payload.adminNote || '',
    completed_at: nextStatus === 'COMPLETED' ? new Date().toISOString() : null,
  };

  if (!hasSupabase) {
    return { ok: true, mode: 'demo', ...updatePayload };
  }

  let query = supabase.from('company_service_requests').update(updatePayload).eq('id', requestId);

  if (access?.role !== 'super_admin') {
    query = query.eq('company_id', access.companyId);
  }

  const { data, error } = await query.select().single();

  if (error) {
    throw error;
  }

  return mapServiceRequests([data])[0];
};

export const createPortalUser = async (payload, access) => {
  if (!hasSupabase) {
    return { ok: true, mode: 'demo' };
  }

  if (access?.role !== 'super_admin' && access?.companyId !== payload.companyId) {
    throw new Error('You can only create users for your own company.');
  }

  const { data, error } = await supabase
    .from('company_users')
    .insert({
      full_name: payload.fullName,
      email: payload.email,
      role: payload.role,
      company_id: payload.companyId,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updatePortalUser = async (userId, payload, access) => {
  if (!hasSupabase) {
    return { ok: true, mode: 'demo' };
  }

  if (access?.role !== 'super_admin' && access?.companyId !== payload.companyId) {
    throw new Error('You can only update users for your own company.');
  }

  const { data, error } = await supabase
    .from('company_users')
    .update({
      full_name: payload.fullName,
      email: payload.email,
      role: payload.role,
      company_id: payload.companyId,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deletePortalUser = async (userId, access) => {
  if (!hasSupabase) {
    return { ok: true, mode: 'demo' };
  }

  if (access?.role !== 'super_admin' && !access?.companyId) {
    throw new Error('You do not have permission to delete users.');
  }

  let query = supabase.from('company_users').delete().eq('id', userId);

  if (access?.role !== 'super_admin') {
    query = query.eq('company_id', access.companyId);
  }

  const { error } = await query;

  if (error) {
    throw error;
  }
};

export const getUserDirectoryForAccess = async (access) => {
  const requests = await getServiceRequestsForAccess(access);
  const usersByEmail = new Map();

  requests.forEach((request) => {
    const emailKey = (request.requesterEmail || '').toLowerCase().trim();
    const mapKey = emailKey || `unknown-${request.id}`;
    const current = usersByEmail.get(mapKey);

    if (!current) {
      usersByEmail.set(mapKey, {
        id: request.id,
        requesterName: request.requesterName || 'Unknown User',
        requesterEmail: request.requesterEmail || '-',
        contactNumber: request.contactNumber || '',
        companyName: request.companyName || '-',
        latestStatus: request.status || 'REQUESTED',
        totalRequests: 1,
        lastUpdatedAt: request.updatedAt || request.createdAt || null,
      });
      return;
    }

    current.totalRequests += 1;

    if (!current.contactNumber && request.contactNumber) {
      current.contactNumber = request.contactNumber;
    }

    const currentUpdated = new Date(current.lastUpdatedAt || 0).getTime();
    const requestUpdated = new Date(request.updatedAt || request.createdAt || 0).getTime();

    if (requestUpdated >= currentUpdated) {
      current.latestStatus = request.status || current.latestStatus;
      current.lastUpdatedAt = request.updatedAt || request.createdAt || current.lastUpdatedAt;
      current.companyName = request.companyName || current.companyName;
      current.requesterName = request.requesterName || current.requesterName;
    }
  });

  if (hasSupabase) {
    const directory = Array.from(usersByEmail.values());
    const emails = directory
      .map((item) => (item.requesterEmail || '').trim())
      .filter((value) => value && value !== '-');

    if (emails.length > 0) {
      const { data: profiles } = await supabase
        .from('portal_user_profiles')
        .select('email, full_name, contact_number, address_line, city, country, company_name')
        .in('email', emails);

      const profileByEmail = new Map((profiles || []).map((profile) => [profile.email.toLowerCase(), profile]));

      directory.forEach((item) => {
        const profile = profileByEmail.get((item.requesterEmail || '').toLowerCase());
        if (!profile) {
          return;
        }

        item.requesterName = profile.full_name || item.requesterName;
        item.contactNumber = profile.contact_number || item.contactNumber;
        item.companyName = profile.company_name || item.companyName;
        item.addressLine = profile.address_line || '';
        item.city = profile.city || '';
        item.country = profile.country || '';
      });
    }
  }

  return Array.from(usersByEmail.values()).sort((a, b) => {
    const aTime = new Date(a.lastUpdatedAt || 0).getTime();
    const bTime = new Date(b.lastUpdatedAt || 0).getTime();
    return bTime - aTime;
  });
};

export const checkUserProfileExists = async (email) => {
  if (!hasSupabase) return true;
  const { data, error } = await supabase
    .from('portal_user_profiles')
    .select('email')
    .eq('email', email)
    .maybeSingle();
  if (error) return false;
  return !!data;
};
