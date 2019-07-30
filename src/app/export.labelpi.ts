//serveral helping interfaces for json parsing... bad style though

export interface EKategorie {
  name: String;
}

export interface EArtikel {
  id: number;
  name: String;
  preis: number;
  artNr: String;
  kategorie: EKategorie;
}

export interface ELabel {
  mac: String;
  x: number;
  y: number;
}

export interface ELabelWrapper {
  artikel: EArtikel;
  label: ELabel;
}
