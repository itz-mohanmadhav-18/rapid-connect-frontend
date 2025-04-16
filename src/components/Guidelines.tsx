
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Guidelines: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-alert" />
          Emergency Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="flood" className="w-full">
          <TabsList className="grid grid-cols-3 mb-3">
            <TabsTrigger value="flood">Flood</TabsTrigger>
            <TabsTrigger value="earthquake">Earthquake</TabsTrigger>
            <TabsTrigger value="fire">Fire</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flood">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-success mr-2" /> Do's
                </h4>
                <ul className="ml-7 text-sm mt-1 space-y-1 list-disc">
                  <li>Move to higher ground immediately</li>
                  <li>Follow evacuation routes</li>
                  <li>Turn off utilities at main switches</li>
                  <li>Avoid walking through moving water</li>
                  <li>Listen to emergency broadcasts</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium flex items-center">
                  <XCircle className="h-4 w-4 text-emergency mr-2" /> Don'ts
                </h4>
                <ul className="ml-7 text-sm mt-1 space-y-1 list-disc">
                  <li>Drive through flooded areas</li>
                  <li>Touch electrical equipment if wet</li>
                  <li>Return to flooded areas until authorities approve</li>
                  <li>Use contaminated water</li>
                  <li>Ignore evacuation orders</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="earthquake">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-success mr-2" /> Do's
                </h4>
                <ul className="ml-7 text-sm mt-1 space-y-1 list-disc">
                  <li>Drop, cover, and hold on</li>
                  <li>Stay indoors until shaking stops</li>
                  <li>Move away from windows and exterior walls</li>
                  <li>If outdoors, find a clear spot away from buildings</li>
                  <li>Be prepared for aftershocks</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium flex items-center">
                  <XCircle className="h-4 w-4 text-emergency mr-2" /> Don'ts
                </h4>
                <ul className="ml-7 text-sm mt-1 space-y-1 list-disc">
                  <li>Run outside during shaking</li>
                  <li>Stand in doorways (modern buildings)</li>
                  <li>Use elevators</li>
                  <li>Light matches or candles</li>
                  <li>Move injured people unless necessary</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="fire">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-success mr-2" /> Do's
                </h4>
                <ul className="ml-7 text-sm mt-1 space-y-1 list-disc">
                  <li>Call emergency services immediately</li>
                  <li>Stay low to avoid smoke inhalation</li>
                  <li>Test doors for heat before opening</li>
                  <li>Use stairs, not elevators</li>
                  <li>Have an evacuation plan</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium flex items-center">
                  <XCircle className="h-4 w-4 text-emergency mr-2" /> Don'ts
                </h4>
                <ul className="ml-7 text-sm mt-1 space-y-1 list-disc">
                  <li>Go back into a burning building</li>
                  <li>Hide in closets or under beds</li>
                  <li>Open hot doors</li>
                  <li>Use water on electrical or grease fires</li>
                  <li>Waste time gathering possessions</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Guidelines;
