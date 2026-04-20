/* eslint-disable react-hooks/set-state-in-effect */
// hooks/useFirestore.ts
import { useState, useEffect } from 'react';
import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/firebaseClient';
import { 
  type Project, 
  type Skill, 
  type Message, 
  type Profile, 
  type ContactFormData, 
  type ProjectFormData, 
  type SkillFormData,
  type ProfileFormData,
  type Service,
  type ServiceFormData,
  COLLECTIONS,
  type HireRequest,
  type HireFormData,
type ProjectDetail,
type ProjectDetailFormData} from '../firebase/models';

// Projects hooks - Using onSnapshot for real-time updates
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const projectsQuery = query(
      collection(db, COLLECTIONS.PROJECTS),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const projectsData: Project[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          projectsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Project);
        });
        
        setProjects(projectsData);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addProject = async (projectData: ProjectFormData): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
        ...projectData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding project:', err);
      throw err;
    }
  };

  const updateProject = async (id: string, projectData: Partial<ProjectFormData>): Promise<void> => {
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, id);
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject
  };
};

// Skills hooks - Using onSnapshot for real-time updates
export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const skillsQuery = query(
      collection(db, COLLECTIONS.SKILLS),
      orderBy('proficiency', 'desc')
    );
    
    const unsubscribe = onSnapshot(
      skillsQuery,
      (snapshot) => {
        const skillsData: Skill[] = [];
        
        snapshot.forEach((doc) => {
          skillsData.push({
            id: doc.id,
            ...doc.data(),
          } as Skill);
        });
        
        setSkills(skillsData);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching skills:', err);
        setError('Failed to fetch skills');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addSkill = async (skillData: SkillFormData): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.SKILLS), skillData);
      return docRef.id;
    } catch (err) {
      console.error('Error adding skill:', err);
      throw err;
    }
  };

  const updateSkill = async (id: string, skillData: Partial<SkillFormData>): Promise<void> => {
    try {
      const skillRef = doc(db, COLLECTIONS.SKILLS, id);
      await updateDoc(skillRef, skillData);
    } catch (err) {
      console.error('Error updating skill:', err);
      throw err;
    }
  };

  const deleteSkill = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.SKILLS, id));
    } catch (err) {
      console.error('Error deleting skill:', err);
      throw err;
    }
  };

  return {
    skills,
    loading,
    error,
    addSkill,
    updateSkill,
    deleteSkill
  };
};

// Messages hooks - Using onSnapshot for real-time updates
export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const messagesQuery = query(
      collection(db, COLLECTIONS.MESSAGES),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messagesData: Message[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          messagesData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as Message);
        });
        
        setMessages(messagesData);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching messages:', err);
        setError('Failed to fetch messages');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addMessage = async (messageData: ContactFormData): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), {
        ...messageData,
        read: false,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding message:', err);
      throw err;
    }
  };

  const markAsRead = async (id: string): Promise<void> => {
    try {
      const messageRef = doc(db, COLLECTIONS.MESSAGES, id);
      await updateDoc(messageRef, { read: true });
    } catch (err) {
      console.error('Error marking message as read:', err);
      throw err;
    }
  };

  const deleteMessage = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.MESSAGES, id));
    } catch (err) {
      console.error('Error deleting message:', err);
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    addMessage,
    markAsRead,
    deleteMessage
  };
};

// Profile hooks - Using onSnapshot for real-time updates
export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const profileQuery = query(collection(db, COLLECTIONS.PROFILE));
    
    const unsubscribe = onSnapshot(
      profileQuery,
      async (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();
          setProfile({
            id: doc.id,
            name: data.name || 'Usman Ahmad',
            title: data.title || 'Software Engineer & AI Solution Architect',
            bio: data.bio || 'Building innovative solutions at the intersection of software engineering and artificial intelligence.',
            profileImage: data.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
            email: data.email || 'usman@example.com',
            location: data.location || 'Lahore, Pakistan',
            university: data.university || 'University of Engineering & Technology, Lahore',
            department: data.department || 'Software Engineering',
            hometown: data.hometown || 'Lahore, Pakistan',
            resumeUrl: data.resumeUrl || '',
            socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
            education: Array.isArray(data.education) ? data.education : [],
            goals: Array.isArray(data.goals) ? data.goals : [],
            experience: Array.isArray(data.experience) ? data.experience : [],
            certifications: Array.isArray(data.certifications) ? data.certifications : [],
            stats: data.stats || { projects: 25, clients: 15, experience: 5 }
          } as Profile);
        } else {
          // Create default profile if none exists
          const defaultProfile: ProfileFormData = {
            name: 'Usman Ahmad',
            title: 'Software Engineer & AI Solution Architect',
            bio: 'Building innovative solutions at the intersection of software engineering and artificial intelligence. I craft scalable applications and intelligent systems that solve real-world problems.',
            profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
            email: 'usman@example.com',
            location: 'Lahore, Pakistan',
            university: 'University of Engineering & Technology, Lahore',
            department: 'Software Engineering',
            hometown: 'Lahore, Pakistan',
            resumeUrl: '',
            socialLinks: [
              { platform: 'github', url: 'https://github.com/usman', icon: 'fab github' },
              { platform: 'linkedin', url: 'https://linkedin.com/in/usman', icon: 'fab linkedin' },
              { platform: 'envelope', url: 'mailto:usman@example.com', icon: 'fas envelope' }
            ],
            education: [
              {
                id: '1',
                institution: 'University of Engineering & Technology (UET), Lahore',
                degree: 'Bachelor of Science',
                field: 'Software Engineering',
                startDate: '2023',
                endDate: '2027',
                current: true,
                description: 'Currently pursuing my degree with a focus on AI, machine learning, and software architecture.'
              }
            ],
            goals: [
              'Build AI-powered solutions for real-world problems',
              'Master cloud-native architectures',
              'Contribute to open-source AI projects',
              'Lead innovative tech projects'
            ],
            experience: [
              'Full-stack web application development',
              'AI/ML model integration and deployment',
              'Cloud infrastructure design and implementation',
              'Technical consulting and solution architecture'
            ],
            certifications: [
              { name: 'AWS Certified Solutions Architect', year: '2024' },
              { name: 'TensorFlow Developer Certificate', year: '2024' }
            ],
            stats: { projects: 25, clients: 15, experience: 5 }
          };
          
          const docRef = await addDoc(collection(db, COLLECTIONS.PROFILE), defaultProfile);
          setProfile({
            id: docRef.id,
            ...defaultProfile,
          } as Profile);
        }
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch profile');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateProfile = async (id: string, profileData: Partial<ProfileFormData>): Promise<void> => {
    try {
      const profileRef = doc(db, COLLECTIONS.PROFILE, id);
      
      const updateData: Record<string, unknown> = {};
      
      Object.keys(profileData).forEach(key => {
        const value = profileData[key as keyof ProfileFormData];
        if (value !== undefined) {
          updateData[key] = value;
        }
      });
      
      if (profileData.stats) {
        updateData.stats = {
          projects: profileData.stats.projects ?? 0,
          clients: profileData.stats.clients ?? 0,
          experience: profileData.stats.experience ?? 0
        };
      }
      
      await updateDoc(profileRef, updateData);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile
  };
};

// Services hooks - Using onSnapshot for real-time updates
export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const servicesQuery = query(
      collection(db, COLLECTIONS.SERVICES),
      orderBy('order', 'asc')
    );
    
    const unsubscribe = onSnapshot(
      servicesQuery,
      (snapshot) => {
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        
        setServices(servicesData);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching services:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addService = async (data: ServiceFormData): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.SERVICES), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding service:', err);
      throw err;
    }
  };

  const updateService = async (id: string, data: Partial<ServiceFormData>): Promise<void> => {
    try {
      const serviceRef = doc(db, COLLECTIONS.SERVICES, id);
      await updateDoc(serviceRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      console.error('Error updating service:', err);
      throw err;
    }
  };

  const deleteService = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.SERVICES, id));
    } catch (err) {
      console.error('Error deleting service:', err);
      throw err;
    }
  };

  return { 
    services, 
    loading, 
    error, 
    addService, 
    updateService, 
    deleteService 
  };
};

// Hire Requests hooks
export const useHireRequests = () => {
  const [hireRequests, setHireRequests] = useState<HireRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const requestsQuery = query(
      collection(db, COLLECTIONS.HIRE_REQUESTS),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const requestsData: HireRequest[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          requestsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as HireRequest);
        });
        
        setHireRequests(requestsData);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching hire requests:', err);
        setError('Failed to fetch hire requests');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addHireRequest = async (requestData: HireFormData): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.HIRE_REQUESTS), {
        ...requestData,
        status: 'new',
        read: false,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding hire request:', err);
      throw err;
    }
  };

  const markAsRead = async (id: string): Promise<void> => {
    try {
      const requestRef = doc(db, COLLECTIONS.HIRE_REQUESTS, id);
      await updateDoc(requestRef, { read: true });
    } catch (err) {
      console.error('Error marking request as read:', err);
      throw err;
    }
  };

  const updateStatus = async (id: string, status: HireRequest['status']): Promise<void> => {
    try {
      const requestRef = doc(db, COLLECTIONS.HIRE_REQUESTS, id);
      await updateDoc(requestRef, { status });
    } catch (err) {
      console.error('Error updating request status:', err);
      throw err;
    }
  };

  const deleteHireRequest = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.HIRE_REQUESTS, id));
    } catch (err) {
      console.error('Error deleting hire request:', err);
      throw err;
    }
  };

  return {
    hireRequests,
    loading,
    error,
    addHireRequest,
    markAsRead,
    updateStatus,
    deleteHireRequest
  };
};


// Add to hooks/useFirestore.ts

export const useProjectDetails = () => {
  const [projectDetails, setProjectDetails] = useState<ProjectDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, COLLECTIONS.PROJECT_DETAILS),
      (snapshot) => {
        const details = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProjectDetail[];
        setProjectDetails(details);
        setLoading(false);
      },
      (err) => { console.error('Error fetching project details:', err); setError(err.message); setLoading(false); }
    );
    return () => unsubscribe();
  }, []);

  const addProjectDetail = async (data: ProjectDetailFormData): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECT_DETAILS), { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
    return docRef.id;
  };

  const updateProjectDetail = async (id: string, data: Partial<ProjectDetailFormData>): Promise<void> => {
    await updateDoc(doc(db, COLLECTIONS.PROJECT_DETAILS, id), { ...data, updatedAt: Timestamp.now() });
  };

  const deleteProjectDetail = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.PROJECT_DETAILS, id));
  };

  return { projectDetails, loading, error, addProjectDetail, updateProjectDetail, deleteProjectDetail };
};