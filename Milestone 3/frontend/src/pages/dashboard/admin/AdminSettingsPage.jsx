import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
      
      <Card 
        title="System Configuration & Integration Settings" 
        subtitle="Global Preferences"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Configure primary API gateways, AI diagnostic engine weights, compliance controls, and system database backups.
          </p>
          <div>
            <Button variant="primary" onClick={() => alert('Feature incoming soon!')}>
              Save Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
