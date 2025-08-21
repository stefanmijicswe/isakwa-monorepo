import { Injectable, Logger } from '@nestjs/common';
import { DataFactory, Writer, Parser } from 'n3';
import { FusekiService } from './fuseki.service';

const { namedNode, literal, quad } = DataFactory;

export interface UniversityRdfData {
  id: number;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  rectorName?: string;
  rectorTitle?: string;
  createdAt: Date;
  updatedAt: Date;
  address?: {
    street: string;
    number: string;
    city: {
      name: string;
      zipCode: string;
      state: {
        name: string;
      };
    };
  };
  faculties?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
}

@Injectable()
export class RdfService {
  private readonly logger = new Logger(RdfService.name);
  private readonly namespace = process.env.RDF_NAMESPACE || 'http://isakwa.pro/ontology/university#';
  private readonly entityNamespace = process.env.RDF_ENTITY_NAMESPACE || 'http://isakwa.pro/data/university/';

  constructor(private readonly fusekiService: FusekiService) {}

  /**
   * Convert University entity to RDF (Turtle format)
   */
  universityToRdf(university: UniversityRdfData): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new Writer();
      const universityUri = namedNode(`${this.entityNamespace}${university.id}`);

      try {
        // University type
        writer.addQuad(
          universityUri,
          namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          namedNode(`${this.namespace}University`)
        );

        // Basic properties
        writer.addQuad(universityUri, namedNode(`${this.namespace}name`), literal(university.name));
        
        if (university.description) {
          writer.addQuad(universityUri, namedNode(`${this.namespace}description`), literal(university.description));
        }
        
        if (university.phone) {
          writer.addQuad(universityUri, namedNode(`${this.namespace}phone`), literal(university.phone));
        }
        
        if (university.email) {
          writer.addQuad(universityUri, namedNode(`${this.namespace}email`), literal(university.email));
        }
        
        if (university.website) {
          writer.addQuad(universityUri, namedNode(`${this.namespace}website`), literal(university.website));
        }

        if (university.rectorName) {
          writer.addQuad(universityUri, namedNode(`${this.namespace}rectorName`), literal(university.rectorName));
        }

        if (university.rectorTitle) {
          writer.addQuad(universityUri, namedNode(`${this.namespace}rectorTitle`), literal(university.rectorTitle));
        }

        // Timestamps
        writer.addQuad(
          universityUri,
          namedNode(`${this.namespace}createdAt`),
          literal(university.createdAt.toISOString(), namedNode('http://www.w3.org/2001/XMLSchema#dateTime'))
        );
        
        writer.addQuad(
          universityUri,
          namedNode(`${this.namespace}updatedAt`),
          literal(university.updatedAt.toISOString(), namedNode('http://www.w3.org/2001/XMLSchema#dateTime'))
        );

        // Address information
        if (university.address) {
          const addressStr = `${university.address.street} ${university.address.number}, ${university.address.city.name} ${university.address.city.zipCode}, ${university.address.city.state.name}`;
          writer.addQuad(universityUri, namedNode(`${this.namespace}address`), literal(addressStr));
          writer.addQuad(universityUri, namedNode(`${this.namespace}city`), literal(university.address.city.name));
          writer.addQuad(universityUri, namedNode(`${this.namespace}country`), literal(university.address.city.state.name));
        }

        // Faculty relationships
        if (university.faculties) {
          university.faculties.forEach(faculty => {
            const facultyUri = namedNode(`${this.entityNamespace.replace('university', 'faculty')}${faculty.id}`);
            writer.addQuad(universityUri, namedNode(`${this.namespace}hasFaculty`), facultyUri);
            
            // Faculty basic info
            writer.addQuad(
              facultyUri,
              namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
              namedNode(`${this.namespace}Faculty`)
            );
            writer.addQuad(facultyUri, namedNode(`${this.namespace}name`), literal(faculty.name));
            writer.addQuad(facultyUri, namedNode(`${this.namespace}belongsToUniversity`), universityUri);
            
            if (faculty.description) {
              writer.addQuad(facultyUri, namedNode(`${this.namespace}description`), literal(faculty.description));
            }
          });
        }

        writer.end((error, result) => {
          if (error) {
            this.logger.error(`Error generating RDF: ${error.message}`);
            reject(error);
          } else {
            this.logger.debug(`Generated RDF for university ${university.id}`);
            resolve(result);
          }
        });
      } catch (error) {
        this.logger.error(`Error creating RDF: ${error.message}`);
        reject(error);
      }
    });
  }

  /**
   * Store University entity in Fuseki server
   */
  async storeUniversityInFuseki(university: UniversityRdfData): Promise<void> {
    try {
      this.logger.log(`Storing university ${university.id} (${university.name}) in Fuseki`);
      
      // Use SPARQL INSERT instead of direct RDF upload
      const universityUri = `${this.entityNamespace}${university.id}`;
      
      // Helper function to escape string literals for SPARQL
      const escapeSparqlString = (str: string) => {
        return str.replace(/\\/g, '\\\\')    // Escape backslashes
                 .replace(/"/g, '\\"')        // Escape double quotes
                 .replace(/\n/g, '\\n')       // Escape newlines
                 .replace(/\r/g, '\\r')       // Escape carriage returns
                 .replace(/\t/g, '\\t');      // Escape tabs
      };

      const insertQuery = `
        PREFIX uni: <${this.namespace}>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        
        INSERT DATA {
          <${universityUri}> rdf:type uni:University ;
                             uni:name "${escapeSparqlString(university.name)}" ;
                             uni:createdAt "${university.createdAt.toISOString()}"^^xsd:dateTime ;
                             uni:updatedAt "${university.updatedAt.toISOString()}"^^xsd:dateTime ${university.description ? `; uni:description "${escapeSparqlString(university.description)}"` : ''} ${university.phone ? `; uni:phone "${escapeSparqlString(university.phone)}"` : ''} ${university.email ? `; uni:email "${escapeSparqlString(university.email)}"` : ''} ${university.website ? `; uni:website "${escapeSparqlString(university.website)}"` : ''} ${university.rectorName ? `; uni:rectorName "${escapeSparqlString(university.rectorName)}"` : ''} ${university.rectorTitle ? `; uni:rectorTitle "${escapeSparqlString(university.rectorTitle)}"` : ''} .
          
          ${university.faculties ? university.faculties.map(faculty => {
            const facultyUri = `${this.entityNamespace.replace('university', 'faculty')}${faculty.id}`;
            return `
            <${universityUri}> uni:hasFaculty <${facultyUri}> .
            <${facultyUri}> rdf:type uni:Faculty ;
                           uni:name "${escapeSparqlString(faculty.name)}" ;
                           uni:belongsToUniversity <${universityUri}> ${faculty.description ? `; uni:description "${escapeSparqlString(faculty.description)}"` : ''} .
            `;
          }).join('') : ''}
        }
      `;
      
      await this.fusekiService.update(insertQuery);
      this.logger.log(`Successfully stored university ${university.id} in Fuseki`);
    } catch (error) {
      this.logger.error(`Failed to store university ${university.id} in Fuseki: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all universities from Fuseki server
   */
  async getAllUniversitiesFromFuseki(): Promise<any[]> {
    const query = `
      PREFIX uni: <${this.namespace}>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      
      SELECT ?university ?name ?description ?phone ?email ?website ?rectorName ?rectorTitle ?address ?city ?country ?createdAt ?updatedAt
      WHERE {
        ?university rdf:type uni:University .
        ?university uni:name ?name .
        OPTIONAL { ?university uni:description ?description }
        OPTIONAL { ?university uni:phone ?phone }
        OPTIONAL { ?university uni:email ?email }
        OPTIONAL { ?university uni:website ?website }
        OPTIONAL { ?university uni:rectorName ?rectorName }
        OPTIONAL { ?university uni:rectorTitle ?rectorTitle }
        OPTIONAL { ?university uni:address ?address }
        OPTIONAL { ?university uni:city ?city }
        OPTIONAL { ?university uni:country ?country }
        OPTIONAL { ?university uni:createdAt ?createdAt }
        OPTIONAL { ?university uni:updatedAt ?updatedAt }
      }
      ORDER BY ?name
    `;

    try {
      const results = await this.fusekiService.query(query);
      this.logger.debug(`Retrieved ${results.length} universities from Fuseki`);
      
      return results.map(row => ({
        id: this.extractIdFromUri(row.university.value),
        uri: row.university.value,
        name: row.name?.value,
        description: row.description?.value,
        phone: row.phone?.value,
        email: row.email?.value,
        website: row.website?.value,
        rectorName: row.rectorName?.value,
        rectorTitle: row.rectorTitle?.value,
        address: row.address?.value,
        city: row.city?.value,
        country: row.country?.value,
        createdAt: row.createdAt?.value ? new Date(row.createdAt.value) : null,
        updatedAt: row.updatedAt?.value ? new Date(row.updatedAt.value) : null,
      }));
    } catch (error) {
      this.logger.error(`Failed to retrieve universities from Fuseki: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get university by ID from Fuseki server
   */
  async getUniversityByIdFromFuseki(id: number): Promise<any> {
    const universityUri = `${this.entityNamespace}${id}`;
    
    const query = `
      PREFIX uni: <${this.namespace}>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      
      SELECT ?name ?description ?phone ?email ?website ?rectorName ?rectorTitle ?address ?city ?country ?createdAt ?updatedAt
      WHERE {
        <${universityUri}> rdf:type uni:University .
        <${universityUri}> uni:name ?name .
        OPTIONAL { <${universityUri}> uni:description ?description }
        OPTIONAL { <${universityUri}> uni:phone ?phone }
        OPTIONAL { <${universityUri}> uni:email ?email }
        OPTIONAL { <${universityUri}> uni:website ?website }
        OPTIONAL { <${universityUri}> uni:rectorName ?rectorName }
        OPTIONAL { <${universityUri}> uni:rectorTitle ?rectorTitle }
        OPTIONAL { <${universityUri}> uni:address ?address }
        OPTIONAL { <${universityUri}> uni:city ?city }
        OPTIONAL { <${universityUri}> uni:country ?country }
        OPTIONAL { <${universityUri}> uni:createdAt ?createdAt }
        OPTIONAL { <${universityUri}> uni:updatedAt ?updatedAt }
      }
    `;

    try {
      const results = await this.fusekiService.query(query);
      
      if (results.length === 0) {
        return null;
      }

      const row = results[0];
      return {
        id,
        uri: universityUri,
        name: row.name?.value,
        description: row.description?.value,
        phone: row.phone?.value,
        email: row.email?.value,
        website: row.website?.value,
        rectorName: row.rectorName?.value,
        rectorTitle: row.rectorTitle?.value,
        address: row.address?.value,
        city: row.city?.value,
        country: row.country?.value,
        createdAt: row.createdAt?.value ? new Date(row.createdAt.value) : null,
        updatedAt: row.updatedAt?.value ? new Date(row.updatedAt.value) : null,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve university ${id} from Fuseki: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get universities with their faculties from Fuseki
   */
  async getUniversitiesWithFacultiesFromFuseki(): Promise<any[]> {
    const query = `
      PREFIX uni: <${this.namespace}>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      
      SELECT ?university ?universityName ?faculty ?facultyName ?facultyDescription
      WHERE {
        ?university rdf:type uni:University .
        ?university uni:name ?universityName .
        OPTIONAL {
          ?university uni:hasFaculty ?faculty .
          ?faculty uni:name ?facultyName .
          OPTIONAL { ?faculty uni:description ?facultyDescription }
        }
      }
      ORDER BY ?universityName ?facultyName
    `;

    try {
      const results = await this.fusekiService.query(query);
      
      // Group results by university
      const universitiesMap = new Map();
      
      results.forEach(row => {
        const universityId = this.extractIdFromUri(row.university.value);
        
        if (!universitiesMap.has(universityId)) {
          universitiesMap.set(universityId, {
            id: universityId,
            uri: row.university.value,
            name: row.universityName.value,
            faculties: [],
          });
        }
        
        if (row.faculty) {
          const facultyId = this.extractIdFromUri(row.faculty.value);
          universitiesMap.get(universityId).faculties.push({
            id: facultyId,
            uri: row.faculty.value,
            name: row.facultyName?.value,
            description: row.facultyDescription?.value,
          });
        }
      });
      
      return Array.from(universitiesMap.values());
    } catch (error) {
      this.logger.error(`Failed to retrieve universities with faculties from Fuseki: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clear all university data from Fuseki
   */
  async clearUniversityDataFromFuseki(): Promise<void> {
    try {
      this.logger.log('Clearing all university data from Fuseki');
      await this.fusekiService.clearDataset();
      this.logger.log('Successfully cleared university data from Fuseki');
    } catch (error) {
      this.logger.error(`Failed to clear university data from Fuseki: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extract ID from URI
   */
  private extractIdFromUri(uri: string): number {
    const parts = uri.split('/');
    return parseInt(parts[parts.length - 1], 10);
  }
}
