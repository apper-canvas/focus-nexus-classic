import React, { useState } from "react";
import { motion } from "framer-motion";
import { differenceInDays, format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";

const STAGES = [
  { id: "Lead", label: "Lead", color: "bg-slate-100" },
  { id: "Qualified", label: "Qualified", color: "bg-blue-100" },
  { id: "Proposal", label: "Proposal", color: "bg-purple-100" },
  { id: "Negotiation", label: "Negotiation", color: "bg-amber-100" },
  { id: "Closed", label: "Closed", color: "bg-green-100" }
];

const DealCard = ({ deal, contact, onDragStart, onEdit }) => {
  const daysInStage = differenceInDays(new Date(), new Date(deal.updatedAt));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card
        draggable
        onDragStart={(e) => onDragStart(e, deal)}
        onClick={() => onEdit(deal)}
        className="p-4 cursor-move hover:shadow-md transition-shadow border-l-4 border-primary mb-3"
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">
            {deal.title}
          </h4>
          <ApperIcon name="GripVertical" size={16} className="text-slate-400 flex-shrink-0 ml-2" />
        </div>
        
<p className="text-xs text-secondary mb-3">{contact?.company_c || contact?.Name || "No company"}</p>

<div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-600">Value:</span>
          <span className="text-lg font-bold text-accent">
            ${(deal.value_c || 0).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="default">{daysInStage}d in stage</Badge>
        </div>

{deal.expected_close_date_c && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center text-xs text-secondary">
              <ApperIcon name="Calendar" size={12} className="mr-1" />
              <span>Close: {format(new Date(deal.expected_close_date_c), "MMM dd")}</span>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

const PipelineBoard = ({ deals, contacts, onUpdateStage, onEdit }) => {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e, stageId) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== stageId) {
      await onUpdateStage(draggedDeal.Id, stageId);
    }
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  const getStageDeals = (stageId) => {
return deals.filter(deal => deal.stage_c === stageId);
  };

  const getStageValue = (stageId) => {
    return getStageDeals(stageId).reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const stageDeals = getStageDeals(stage.id);
        const stageValue = getStageValue(stage.id);
        const isDragOver = dragOverStage === stage.id;

        return (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80"
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className={`rounded-lg p-4 ${stage.color} ${isDragOver ? "ring-2 ring-primary" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">
                    {stage.label}
                  </h3>
                  <p className="text-xs text-secondary">
                    {stageDeals.length} deals · ${stageValue.toLocaleString()}
                  </p>
                </div>
                <Badge variant="default">{stageDeals.length}</Badge>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {stageDeals.map((deal) => {
const contact = contacts.find(c => c.Id === (deal.contact_id_c?.Id || deal.contact_id_c));
                  return (
                    <DealCard
                      key={deal.Id}
                      deal={deal}
                      contact={contact}
                      onDragStart={handleDragStart}
                      onEdit={onEdit}
                    />
                  );
                })}
                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-sm text-secondary">
                    No deals in this stage
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineBoard;