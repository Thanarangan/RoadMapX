import { api, type Role } from "./api";

export interface LoginResponse {
  token: string;
  role: Role;
  username: string;
}

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<LoginResponse>("/login", { email, password });
    return data;
  },
  async register(payload: { username: string; password: string; email: string }) {
    const { data } = await api.post("/register", payload);
    return data;
  },
  async createContentManager(payload: { username: string; password: string; email: string }) {
    const { data } = await api.post("/admin/content-managers", payload);
    return data;
  },
};

export interface Domain {
  id: number;
  name: string;
  description?: string;
  active?: boolean;
  status?: string;
  createdBy?: string;
  createdAt?: string;
}

function normalizeDomain(d: any): Domain {
  return {
    id: d.id ?? d.dId ?? d.did ?? d.DId,
    name: d.name ?? d.dName ?? d.dname ?? d.DName,
    description: d.description ?? d.dDesc,
    active: d.active ?? d.dStatus === "ACTIVE",
    status: d.status ?? d.dStatus,
    createdBy: d.createdBy ?? d.dCreatedBy,
    createdAt: d.createdAt ?? d.dCreatedAt,
  };
}

export const domainService = {
  list: async (): Promise<Domain[]> => ((await api.get("/api/domains")).data ?? []).map(normalizeDomain),
  listAdmin: async (): Promise<Domain[]> =>
    ((await api.get("/api/domains/admin/all")).data ?? []).map(normalizeDomain),
  pending: async (): Promise<Domain[]> =>
    ((await api.get("/api/domains/getAllInactiveDomains")).data ?? []).map(normalizeDomain),
  add: async (payload: Partial<Domain>) =>
    (await api.post("/api/domains/addDomain", {
      dName: payload.name,
      dDesc: payload.description,
      dCreatedBy: payload.createdBy ?? "Admin",
    })).data,
  addAdmin: async (payload: Partial<Domain>) =>
    (await api.post("/api/domains/admin/addDomain", {
      dName: payload.name,
      dDesc: payload.description,
      dCreatedBy: payload.createdBy ?? "Admin",
    })).data,
  remove: async (id: number) => (await api.delete(`/api/domains/admin/${id}`)).data,
  approve: async (id: number) => (await api.put(`/api/domains/${id}/approve`)).data,
  reject: async (id: number) => (await api.put(`/api/domains/${id}/reject`)).data,
  addToUser: async (id: number) =>
    (await api.post(`/api/domainservices/addDomainToUser/${id}`)).data,
  current: async (): Promise<Domain | null> => {
    const { data } = await api.get("/api/domainservices/current");
    return data ? normalizeDomain(data) : null;
  },
};

export interface Roadmap {
  id: number;
  name: string;
  description?: string;
  domainId?: number;
  status?: string;
  topicCount?: number;
  createdBy?: string;
}

function normalizeRoadmap(r: any): Roadmap {
  return {
    id: r.id ?? r.rId ?? r.rid ?? r.RId,
    name: r.name ?? r.rName ?? r.rname ?? r.RName,
    description: r.description ?? r.rDesc,
    domainId: r.domainId ?? r.domain?.id ?? r.domain?.dId ?? r.domain?.did ?? r.domain?.DId,
    status: r.status ?? r.rStatus,
    topicCount: r.topicCount,
    createdBy: r.createdBy ?? r.rCreatedBy,
  };
}

export const roadmapService = {
  byDomain: async (domainId: number): Promise<Roadmap[]> =>
    ((await api.get(`/roadmap/domain/${domainId}`)).data ?? []).map(normalizeRoadmap),
  drafts: async (): Promise<Roadmap[]> => ((await api.get("/roadmap/cm/draft")).data ?? []).map(normalizeRoadmap),
  listAdmin: async (): Promise<Roadmap[]> =>
    ((await api.get("/roadmap/admin/all")).data ?? []).map(normalizeRoadmap),
  pendingAdmin: async (): Promise<Roadmap[]> =>
    ((await api.get("/roadmap/admin/pending")).data ?? []).map(normalizeRoadmap),
  addDraft: async (payload: Partial<Roadmap>) =>
    normalizeRoadmap((await api.post("/roadmap/cm/adddraft", {
      rName: payload.name,
      rDesc: payload.description,
      domainId: payload.domainId,
      rCreatedBy: payload.createdBy ?? "Admin",
    })).data),
  update: async (id: number, payload: Partial<Roadmap>) =>
    normalizeRoadmap((await api.put(`/roadmap/cm/${id}`, {
      rName: payload.name,
      rDesc: payload.description,
      domainId: payload.domainId,
      rCreatedBy: payload.createdBy ?? "Admin",
    })).data),
  submit: async (payload: Partial<Roadmap>) => (await api.post("/roadmap/cm/add", {
    rName: payload.name,
    rDesc: payload.description,
    domainId: payload.domainId,
    rCreatedBy: payload.createdBy ?? "Admin",
  })).data,
  addAdmin: async (payload: Partial<Roadmap>) => (await api.post("/roadmap/admin/add", {
    rName: payload.name,
    rDesc: payload.description,
    domainId: payload.domainId,
    rCreatedBy: payload.createdBy ?? "Admin",
  })).data,
  submitDraft: async (id: number) => (await api.put(`/roadmap/cm/${id}/submit`)).data,
  remove: async (id: number) => (await api.delete(`/roadmap/admin/${id}`)).data,
  approve: async (id: number) => (await api.put(`/roadmap/admin/${id}/approve`)).data,
};

export interface Topic {
  id: number;
  name: string;
  description?: string;
  roadMapId?: number;
  orderIndex?: number;
  resourceCount?: number;
}

function normalizeTopic(t: any): Topic {
  return {
    id: t.id ?? t.tId ?? t.tid ?? t.TId,
    name: t.name ?? t.tName ?? t.tname ?? t.TName,
    description: t.description ?? t.tDesc,
    roadMapId: t.roadMapId ?? t.roadMap?.id ?? t.roadMap?.rId ?? t.roadMap?.rid ?? t.roadMap?.RId,
    orderIndex: t.orderIndex,
    resourceCount: t.resourceCount,
  };
}

export const topicService = {
  byRoadmap: async (roadmapId: number): Promise<Topic[]> =>
    ((await api.get(`/topics/roadmap/${roadmapId}`)).data ?? []).map(normalizeTopic),
  add: async (payload: Partial<Topic>) => normalizeTopic((await api.post("/topics/cm/addTopic", {
    tName: payload.name,
    tDesc: payload.description,
    roadmapId: payload.roadMapId,
  })).data),
  update: async (id: number, payload: Partial<Topic>) =>
    (await api.put(`/topics/cm/updatetopic/${id}`, {
      tName: payload.name,
      tDesc: payload.description,
      roadmapId: payload.roadMapId,
    })).data,
  remove: async (id: number) => (await api.delete(`/topics/cm/deletetopic/${id}`)).data,
};

export type ResourceType = "PDF" | "VIDEO" | "ARTICLE" | "WEBSITE" | "BOOK";
export interface Resource {
  id: number;
  title: string;
  url: string;
  type: ResourceType;
  topicId?: number;
  description?: string;
}

function normalizeResource(r: any): Resource {
  return {
    id: r.id ?? r.resId ?? r.resid ?? r.ResId,
    title: r.title ?? r.resName,
    url: r.url ?? r.resUrl,
    type: r.type ?? r.resType,
    topicId: r.topicId ?? r.topic?.id ?? r.topic?.tId ?? r.topic?.tid ?? r.topic?.TId,
    description: r.description ?? r.resDesc,
  };
}

export const resourceService = {
  byTopic: async (topicId: number): Promise<Resource[]> =>
    ((await api.get(`/resources/topic/${topicId}`)).data ?? []).map(normalizeResource),
  add: async (payload: Partial<Resource>) => (await api.post("/resources/add", {
    resName: payload.title,
    resType: payload.type,
    resDesc: payload.description,
    resUrl: payload.url,
    topicId: payload.topicId,
  })).data,
  update: async (id: number, payload: Partial<Resource>) =>
    (await api.put(`/resources/update/${id}`, {
      resName: payload.title,
      resType: payload.type,
      resDesc: payload.description,
      resUrl: payload.url,
      topicId: payload.topicId,
    })).data,
  remove: async (id: number) => (await api.delete(`/resources/delete/${id}`)).data,
};

export interface TopicProgress {
  id: number;
  topicId: number;
  roadMapId: number;
  completed?: boolean;
  completedAt?: string;
}

function normalizeTopicProgress(p: any): TopicProgress {
  return {
    id: p.id ?? p.progressId,
    topicId: p.topicId,
    roadMapId: p.roadMapId,
    completed: p.completed ?? p.isCompleted,
    completedAt: p.completedAt,
  };
}

export const progressService = {
  byRoadmap: async (roadMapId: number): Promise<TopicProgress[]> =>
    ((await api.get(`/user-topic-progress/${roadMapId}`)).data ?? []).map(normalizeTopicProgress),
  save: async (payload: Partial<TopicProgress>) =>
    (await api.post("/user-topic-progress/save", payload)).data,
  remove: async (id: number) => (await api.delete(`/user-topic-progress/delete/${id}`)).data,
};
