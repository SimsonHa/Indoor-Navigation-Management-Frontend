import { Injectable } from '@angular/core';
import { Waypoint } from './visual-editor/visual.waypoint';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Canvas } from './visual-editor/visual.canvas';

@Injectable()
export class WaypointService {

  waypoints: Waypoint[] = [];

  private canvas: Canvas;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {}

  reloadWaypoints() {
    this.http.get<JSON>("http://localhost:8080/getNetz", this.httpOptions).subscribe(text => {
      this.deserialize(text);
    });
  }

  getWaypoints(): Waypoint[] {
    return this.waypoints;
  }

  addWaypoint(waypoint: Waypoint) {
    if (this.waypoints.length > 1) {
      this.waypoints[this.waypoints.length - 1].status = "";
    }
    this.waypoints.push(waypoint);
  }

  saveWaypoints() {
    this.http.post<String>("http://localhost:8080/netz", this.stringifyWaypoints(), this.httpOptions).subscribe();
  }

  //json mapping
  stringifyWaypoints(): String {
    let exportWaypoints: ExportWaypoint[] = [];

    this.waypoints.forEach(waypoint => {
      let wp: ExportWaypoint = {
        id: waypoint.id,
        x: waypoint.x,
        y: waypoint.y,
        status: waypoint.status,
        connectedTo: []
      }

      waypoint.connectedTo.forEach(connection => {
        wp.connectedTo.push(connection.id);
      });
      exportWaypoints.push(wp);
    });
    return "{\"wrapperNetzArr\":" + JSON.stringify(exportWaypoints) + "}";
  }

  //json mapping
  deserialize(json: JSON) {
    let exportWaypoints: ExportWaypoint[] = JSON.parse(JSON.stringify(json));
    let tempWaypoints: Waypoint[] = [];

    // a lot of mapping to prevent circular jsons
    //map exportWP to internWP
    exportWaypoints.forEach(wp => {
      tempWaypoints.push(new Waypoint(wp.x, wp.y));
      tempWaypoints[tempWaypoints.length - 1].id = wp.id;
      tempWaypoints[tempWaypoints.length - 1].status = wp.status;
    });

    for (let i = 0; i < tempWaypoints.length; i++) {
      for (let j = 0; j < exportWaypoints[i].connectedTo.length; j++) {
        //retrieves object by id and adds it to "connectedTo[]" in intern waypoint
        let toBeConnected: Waypoint = tempWaypoints.filter(waypoint => waypoint.id === exportWaypoints[i].connectedTo[j])[0];
        if (toBeConnected) {
          tempWaypoints[i].addConnection(toBeConnected);
        }
      }
    }
    this.waypoints = tempWaypoints;
    this.canvas.updateWaypoints();
    this.canvas.drawPathes();
  }

  setCanvas(canvas: Canvas) {
    this.canvas = canvas;
  }
}
