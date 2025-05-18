
import React, { useState, useEffect, useRef } from 'react';
import { Contact } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, User, Briefcase, Building, Phone, Smartphone, Mail, Link as LinkIcon, Save, ImageUp } from 'lucide-react';

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

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the avatarUrl to the Data URL (Base64 string)
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // formData.avatarUrl will now be a Data URL if an image was uploaded,
    // or an existing http/https URL if not changed, or empty string.
    onSubmit(formData);
    onClose(); // Close form after submission
  };
  
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (!names[0] || names[0] === '') return ''; // Handle empty or whitespace-only name
    if (names.length === 1) return names[0][0]?.toUpperCase() || '';
    return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
  };

  const formFields = [
    { name: "name", label: "Full Name", type: "text", icon: User, required: true },
    { name: "email", label: "Email", type: "email", icon: Mail, required: true },
    { name: "jobTitle", label: "Job Title", type: "text", icon: Briefcase, required: true },
    { name: "department", label: "Department", type: "text", icon: Building, required: true },
    { name: "mobile", label: "Mobile Phone", type: "tel", icon: Smartphone },
    { name: "officePhone", label: "Office Phone", type: "tel", icon: Phone },
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
            {/* Avatar Upload Section */}
            <div className="md:col-span-2 flex flex-col items-center space-y-2">
              <Label htmlFor="avatar-upload" className="text-sm font-medium flex items-center self-start">
                <User size={14} className="mr-2 text-primary/80" />
                Avatar
              </Label>
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                aria-label="Upload avatar image"
              >
                <Avatar className="h-32 w-32 border-2 border-dashed border-primary/50 group-hover:border-primary transition-colors">
                  {/* formData.avatarUrl will be a Data URL, http/https URL, or empty */}
                  <AvatarImage src={formData.avatarUrl || undefined} alt={formData.name} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary/80">
                    {/* Show initials if avatarUrl is present but not loading (e.g. broken link), or ImageUp if no avatarUrl */}
                    {(formData.avatarUrl && getInitials(formData.name)) ? getInitials(formData.name) : <ImageUp size={48} />}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <ImageUp size={32} className="text-white" />
                </div>
              </div>
              <input
                id="avatar-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {/* Show "Clear" button if a new image (Data URL) has been selected */}
              {formData.avatarUrl && formData.avatarUrl.startsWith('data:image/') && (
                <Button type="button" variant="link" size="sm" className="text-xs" onClick={() => setFormData(prev => ({...prev, avatarUrl: initialData?.avatarUrl || ''}))}>
                  Clear selected image
                </Button>
              )}
            </div>

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
