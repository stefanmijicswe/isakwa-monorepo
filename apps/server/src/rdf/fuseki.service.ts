import { Injectable, Logger } from '@nestjs/common';
import SparqlHttpClient from 'sparql-http-client';
import { Readable } from 'stream';

export interface FusekiConfig {
  baseUrl: string;
  dataset: string;
  timeout?: number;
}

@Injectable()
export class FusekiService {
  private readonly logger = new Logger(FusekiService.name);
  private readonly client: SparqlHttpClient;
  private readonly config: FusekiConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.FUSEKI_BASE_URL || 'http://localhost:3030',
      dataset: 'universities',
      timeout: 10000,
    };

    this.client = new SparqlHttpClient({
      endpointUrl: `${this.config.baseUrl}/${this.config.dataset}/sparql`,
      updateUrl: `${this.config.baseUrl}/${this.config.dataset}/update`,
    });

    this.logger.log(`Initialized Fuseki client for ${this.config.baseUrl}/${this.config.dataset}`);
  }

  /**
   * Execute a SPARQL SELECT query
   */
  async query(sparql: string): Promise<any[]> {
    try {
      this.logger.debug(`Executing SPARQL query: ${sparql}`);
      
      const stream = await this.client.query.select(sparql);
      const results: any[] = [];
      
      return new Promise((resolve, reject) => {
        stream.on('data', (row: any) => {
          results.push(row);
        });
        
        stream.on('end', () => {
          this.logger.debug(`Query returned ${results.length} results`);
          resolve(results);
        });
        
        stream.on('error', (error: Error) => {
          this.logger.error(`SPARQL query error: ${error.message}`);
          reject(error);
        });
      });
    } catch (error) {
      this.logger.error(`Failed to execute SPARQL query: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute a SPARQL UPDATE query (INSERT, DELETE, etc.)
   */
  async update(sparql: string): Promise<void> {
    try {
      this.logger.debug(`Executing SPARQL update: ${sparql}`);
      
      await this.client.query.update(sparql);
      this.logger.debug('SPARQL update completed successfully');
    } catch (error) {
      this.logger.error(`Failed to execute SPARQL update: ${error.message}`);
      throw error;
    }
  }

  /**
   * Insert RDF data directly to the dataset
   */
  async insertRdf(rdfData: string, contentType: string = 'text/turtle'): Promise<void> {
    try {
      this.logger.debug(`Inserting RDF data (${contentType})`);
      
      const response = await fetch(`${this.config.baseUrl}/${this.config.dataset}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
        },
        body: rdfData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.logger.debug('RDF data inserted successfully');
    } catch (error) {
      this.logger.error(`Failed to insert RDF data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clear all data from the dataset
   */
  async clearDataset(): Promise<void> {
    try {
      this.logger.debug('Clearing dataset');
      
      const clearQuery = `
        DELETE WHERE {
          ?s ?p ?o .
        }
      `;
      
      await this.update(clearQuery);
      this.logger.debug('Dataset cleared successfully');
    } catch (error) {
      this.logger.error(`Failed to clear dataset: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if Fuseki server is accessible
   */
  async healthCheck(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      
      const response = await fetch(`${this.config.baseUrl}/$/ping`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      this.logger.error(`Fuseki health check failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Get dataset information
   */
  async getDatasetInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/$/datasets/${this.config.dataset}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error(`Failed to get dataset info: ${error.message}`);
      throw error;
    }
  }
}
