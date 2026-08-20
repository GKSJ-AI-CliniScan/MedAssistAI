import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function ManageStaffPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Staff</h1>
      
      <Card 
        title="Administrative Staff Directory" 
        subtitle="Manage Support & Roster Controls"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Configure administrative permissions, onboard clinic staff members, and assign support rosters.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Add Staff Member
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
