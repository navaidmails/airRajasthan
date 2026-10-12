"use client";

import { useState } from "react";
import { TrackingResult, TrackingShipment } from "@/features/tracking/types";
import { Search, Plane, CheckCircle2, Clock, AlertTriangle, ShieldCheck, ArrowRight, Package, Scale, MapPin } from "lucide-react";

interface TrackingWidgetProps {
  initialReference?: string;
  variant?: "compact" | "full";
}

export function TrackingWidget({ initialReference = "", variant = "full" }: TrackingWidgetProps) {
  const [reference, setReference] = useState(initialReference);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);

  const sampleReferences = ["AR-7842-DEL", "AR-9104-JAI", "AR-3321-BOM"];

  const handleTrack = async (refToTrack?: string) => {
    const targetRef = (refToTrack ?? reference).trim();
    if (!targetRef) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/tracking?ref=${encodeURIComponent(targetRef)}`);
      const data: TrackingResult = await res.json();
      setResult(data);
    } catch {
      setResult({
        found: false,
        message: "An error occurred while connecting to the tracking service.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (ref: string) => {
    setReference(ref);
    handleTrack(ref);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-aviation p-6 md:p-8">
      {/* Widget Header & Demo Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-saffron-500" />
            <h3 className="text-lg font-bold text-navy-950">
              Live Air Cargo Tracking
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status, ULD checkpoint timestamps, and flight manifests
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Demo Simulation Engine</span>
        </div>
      </div>

      {/* Input Search Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleTrack();
        }}
        className="mt-6 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Enter Airway Bill / Reference (e.g. AR-7842-DEL)"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 uppercase font-mono tracking-wider outline-none transition-all placeholder:normal-case placeholder:font-sans"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !reference.trim()}
          className="btn-navy px-7 py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Track AWB</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Sample Reference Buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span className="font-semibold text-slate-500">Test Sample AWBs:</span>
        {sampleReferences.map((ref) => (
          <button
            key={ref}
            type="button"
            onClick={() => handleSampleClick(ref)}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-navy-900 font-mono text-[11px] font-semibold border border-slate-200 transition-colors"
          >
            {ref}
          </button>
        ))}
      </div>

      {/* Tracking Results View */}
      {result && (
        <div className="mt-8 pt-6 border-t border-slate-100 transition-all">
          {result.found && result.shipment ? (
            <ShipmentDetails shipment={result.shipment} />
          ) : (
            <div className="p-5 rounded-xl bg-red-50/70 border border-red-200 flex items-start gap-3 text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">No demo shipment found</p>
                <p className="text-xs text-red-700 mt-1">{result.message}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ShipmentDetails({ shipment }: { shipment: TrackingShipment }) {
  const getStatusBadge = (status: TrackingShipment["status"]) => {
    switch (status) {
      case "IN_TRANSIT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "CUSTOMS_CLEARED":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Shipment Header Banner */}
      <div className="bg-navy-950 text-white rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-saffron-400 font-bold font-mono">
                AWB: {shipment.trackingNumber}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                  shipment.status
                )}`}
              >
                {shipment.statusLabel}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-lg md:text-xl font-bold">
              <span>{shipment.origin.split("-")[0].trim()}</span>
              <ArrowRight className="w-5 h-5 text-saffron-400" />
              <span>{shipment.destination.split("-")[0].trim()}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {shipment.origin} &rarr; {shipment.destination}
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 text-xs text-slate-300 pt-3 md:pt-0 border-t md:border-t-0 border-navy-850">
            {shipment.flightNumber && (
              <div>
                <span className="text-slate-400">Flight: </span>
                <span className="font-semibold text-white">{shipment.flightNumber}</span>
              </div>
            )}
            {shipment.aircraftType && (
              <div>
                <span className="text-slate-400">Equipment: </span>
                <span className="font-semibold text-white">{shipment.aircraftType}</span>
              </div>
            )}
            {shipment.estimatedDelivery && (
              <div>
                <span className="text-slate-400">Est. Arrival: </span>
                <span className="font-semibold text-saffron-400">{shipment.estimatedDelivery}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cargo Specs Badges */}
        <div className="mt-5 pt-4 border-t border-navy-850/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-saffron-400" />
            <div>
              <p className="text-slate-400 text-[10px]">Total Pieces</p>
              <p className="font-semibold">{shipment.pieces} Units</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-saffron-400" />
            <div>
              <p className="text-slate-400 text-[10px]">Gross Weight</p>
              <p className="font-semibold">{shipment.weight} {shipment.weightUnit}</p>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-saffron-400" />
            <div>
              <p className="text-slate-400 text-[10px]">Commodity</p>
              <p className="font-semibold truncate">{shipment.commodity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Progression Timeline */}
      <div>
        <h4 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>Consignment Milestones</span>
          <span className="text-[11px] font-normal text-slate-500 lowercase">(simulation data)</span>
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {shipment.milestones.map((m, idx) => {
            const isCompleted = m.status === "COMPLETED";
            const isCurrent = m.status === "CURRENT";

            return (
              <div key={idx} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-saffron-500 text-white animate-pulse"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                  )}
                </div>

                {/* Content card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-saffron-50/50 border-saffron-200 shadow-sm"
                      : isCompleted
                      ? "bg-white border-slate-200/80"
                      : "bg-slate-50/50 border-slate-150 opacity-70"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h5
                      className={`text-sm font-bold ${
                        isCurrent ? "text-saffron-950" : "text-navy-950"
                      }`}
                    >
                      {m.stage}
                    </h5>
                    <span className="text-xs font-mono text-slate-500">{m.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{m.location}</p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{m.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
