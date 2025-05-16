
import React, { useState, useEffect } from 'react';
import { Contact } from '@/types';
import ContactCard from '@/components/ContactCard';
import ContactForm from '@/components/ContactForm';
import Preloader from '@/components/Preloader';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

// Sample initial data (can be fetched from an API later)
const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Jane Doe',
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    email: 'jane.doe@example.com',
    mobile: '+1234567890',
    avatarUrl: 'https://i.pravatar.cc/150?u=jane.doe@example.com',
    linkedin: 'https://linkedin.com/in/janedoe',
    twitter: 'https://twitter.com/janedoe',
  },
  {
    id: '2',
    name: 'John Smith',
    jobTitle: 'Graphic Designer',
    department: 'Design',
    email: 'john.smith@example.com',
    officePhone: '+0987654321',
    avatarUrl: 'https://i.pravatar.cc/150?u=john.smith@example.com',
    github: 'https://github.com/johnsmith',
  },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setContacts(initialContacts); // Load initial contacts
      setIsLoading(false);
    }, 1500); // Adjust loading time as needed
    return () => clearTimeout(timer);
  }, []);

  const handleAddContact = () => {
    setEditingContact(null);
    setIsFormOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = (contactId: string) => {
    // Add a confirmation dialog here in a real app
    setContacts(prevContacts => prevContacts.filter(c => c.id !== contactId));
  };

  const handleFormSubmit = (contactData: Omit<Contact, 'id'> | Contact) => {
    if ('id' in contactData && contactData.id) { // Editing existing contact
      setContacts(prevContacts => 
        prevContacts.map(c => c.id === contactData.id ? { ...c, ...contactData } : c)
      );
    } else { // Adding new contact
      const newContact: Contact = {
        ...contactData,
        id: new Date().toISOString(), // Simple unique ID
      };
      setContacts(prevContacts => [newContact, ...prevContacts]);
    }
    setIsFormOpen(false);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 transition-colors duration-300">
      <header className="mb-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-4">
          <h1 className="text-4xl font-bold text-primary mb-4 md:mb-0">Contact Manager</h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button onClick={handleAddContact} className="btn-primary">
              <PlusCircle size={20} className="mr-2" />
              Add Contact
            </Button>
          </div>
        </div>
        <div className="container mx-auto mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts (name, email, title)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full md:w-1/2 lg:w-1/3"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto">
        {filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContacts.map(contact => (
              <ContactCard 
                key={contact.id} 
                contact={contact} 
                onEdit={handleEditContact} 
                onDelete={handleDeleteContact} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              {searchTerm ? "No contacts match your search." : "No contacts yet. Add one to get started!"}
            </p>
            {!searchTerm && (
                <Button onClick={handleAddContact} className="btn-primary mt-4">
                <PlusCircle size={20} className="mr-2" />
                Add Your First Contact
                </Button>
            )}
          </div>
        )}
      </main>

      <ContactForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingContact}
      />
      
      <footer className="container mx-auto text-center py-8 mt-12 border-t border-border">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Animated CRUD Delight. Built with Lovable.</p>
      </footer>
    </div>
  );
};

export default Index;
