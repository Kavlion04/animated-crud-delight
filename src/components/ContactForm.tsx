
import React, { useState, useEffect } from 'react';
import { Contact } from '@/types';
import { Button } from "@/components/ui/button"; // Using shadcn button
import { Input } from "@/components/ui/input"; // Using shadcn input
import { Label } from "@/components/ui/label"; // Using shadcn label
import { X, User, Briefcase, Building, Phone, Smartphone, Mail, Link as LinkIcon, Save } from 'lucide-react'; // Renamed Link to LinkIcon to avoid conflict

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contact: Omit<Contact, 'id'> | Contact) => void;
  initialData?: Contact | null;
}

const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<Contact, 'id'> | Contact>({
    name: '',
    jobTitle: '',
    department: '',
    email: '',
    officePhone: '',
    mobile: '',
    avatarUrl: '',
    linkedin: '',
    twitter: '',
    github: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '', jobTitle: '', department: '', email: '',
        officePhone: '', mobile: '', avatarUrl: '',
        linkedin: '', twitter: '', github: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // Close form after submission
  };
  
  const formFields = [
    { name: "name", label: "Full Name", type: "text", icon: User, required: true },
    { name: "email", label: "Email", type: "email", icon: Mail, required: true },
    { name: "jobTitle", label: "Job Title", type: "text", icon: Briefcase, required: true },
    { name: "department", label: "Department", type: "text", icon: Building, required: true },
    { name: "mobile", label: "Mobile Phone", type: "tel", icon: Smartphone },
    { name: "officePhone", label: "Office Phone", type: "tel", icon: Phone },
    { name: "avatarUrl", label: "Avatar URL (placeholder)", type: "text", icon: LinkIcon },
    { name: "linkedin", label: "LinkedIn URL", type: "url", icon: LinkIcon },
    { name: "twitter", label: "Twitter URL", type: "url", icon: LinkIcon },
    { name: "github", label: "GitHub URL", type: "url", icon: LinkIcon },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card text-card-foreground rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-primary">{initialData ? 'Edit Contact' : 'Add New Contact'}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X size={20} />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.map(field => (
              <div key={field.name} className="space-y-1">
                <Label htmlFor={field.name} className="text-sm font-medium flex items-center">
                  <field.icon size={14} className="mr-2 text-primary/80" />
                  {field.label} {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={(formData as any)[field.name] || ''}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required={field.required}
                  className="input-field"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary">
              <Save size={18} className="mr-2" />
              {initialData ? 'Save Changes' : 'Add Contact'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
