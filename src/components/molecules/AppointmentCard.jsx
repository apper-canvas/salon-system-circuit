import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const AppointmentCard = ({ 
  appointment, 
  client, 
  service, 
  staff,
  onEdit,
  onCancel,
  className 
}) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed": return "success";
      case "pending": return "warning";
      case "cancelled": return "error";
      case "completed": return "default";
      default: return "default";
    }
  };

  return (
    <Card className={cn("p-4 hover:scale-[1.02] transition-transform duration-200", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
<h3 className="font-semibold text-primary-800">{client?.name_c || client?.name}</h3>
            <Badge variant={getStatusVariant(appointment.status_c || appointment.status)}>
              {appointment.status_c || appointment.status}
            </Badge>
          </div>
          <p className="text-sm text-secondary-600 mb-1">
<ApperIcon name="Clock" className="inline h-4 w-4 mr-1" />
            {format(new Date(`2024-01-01T${appointment.start_time_c || appointment.startTime}`), "h:mm a")} - {format(new Date(`2024-01-01T${appointment.end_time_c || appointment.endTime}`), "h:mm a")}
          </p>
          <p className="text-sm text-secondary-600 mb-1">
            <ApperIcon name="Scissors" className="inline h-4 w-4 mr-1" />
{service?.name_c || service?.name} (${service?.price_c || service?.price})
          </p>
          <p className="text-sm text-secondary-600">
            <ApperIcon name="User" className="inline h-4 w-4 mr-1" />
{staff?.name_c || staff?.name}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button size="sm" variant="outline" onClick={() => onEdit?.(appointment)}>
            <ApperIcon name="Edit" className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onCancel?.(appointment.Id)}>
            <ApperIcon name="X" className="h-4 w-4" />
          </Button>
        </div>
      </div>
{(appointment.notes_c || appointment.notes) && (
        <div className="mt-3 pt-3 border-t border-secondary-100">
          <h4 className="text-sm font-medium text-primary-600 mb-1">Notes</h4>
          <p className="text-sm text-secondary-600">
            {appointment.notes_c || appointment.notes}
          </p>
        </div>
      )}
    </Card>
  );
};

export default AppointmentCard;