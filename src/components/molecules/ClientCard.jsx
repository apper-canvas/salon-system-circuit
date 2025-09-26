import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ClientCard = ({ 
  client, 
  onEdit, 
  onViewHistory,
  onBookAppointment,
  className 
}) => {
  return (
    <Card className={cn("p-4 hover:scale-[1.02] transition-transform duration-200", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-primary-800 mb-2">{client.name}</h3>
          <div className="space-y-1">
            <p className="text-sm text-secondary-600 flex items-center">
              <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
              {client.phone}
            </p>
            <p className="text-sm text-secondary-600 flex items-center">
              <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
              {client.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button size="sm" variant="accent" onClick={() => onBookAppointment?.(client)}>
            <ApperIcon name="Calendar" className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit?.(client)}>
            <ApperIcon name="Edit" className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {client.preferences && (
        <div className="mb-3">
          <p className="text-xs font-medium text-secondary-500 mb-1">Preferences</p>
          <p className="text-sm text-secondary-600">{client.preferences}</p>
        </div>
      )}
      
      {client.notes && (
        <div className="mb-3">
          <p className="text-xs font-medium text-secondary-500 mb-1">Notes</p>
          <p className="text-sm text-secondary-600">{client.notes}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-secondary-100">
        <p className="text-xs text-secondary-500">
          Client since {new Date(client.createdAt).getFullYear()}
        </p>
        <Button size="sm" variant="ghost" onClick={() => onViewHistory?.(client)}>
          View History
        </Button>
      </div>
    </Card>
  );
};

export default ClientCard;