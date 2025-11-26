import { SearchServiceClient } from '@google-cloud/discoveryengine';

// Initialize client
const client = new SearchServiceClient();

export interface SearchResult {
  id: string;
  title: string;
  uri: string;
  snippet: string;
  data: any;
}

export async function searchFinancialProducts(query: string): Promise<SearchResult[]> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  const location = 'global'; // or specific location
  const collectionId = 'default_collection';
  const dataStoreId = process.env.VERTEX_SEARCH_DATA_STORE_ID;

  if (!projectId || !dataStoreId) {
    console.warn('Vertex AI Search credentials not set');
    return [];
  }

  const name = client.projectLocationCollectionDataStoreServingConfigPath(
    projectId,
    location,
    collectionId,
    dataStoreId,
    'default_search'
  );

  try {
    const request = {
      servingConfig: name,
      query: query,
      pageSize: 5,
    };

    const [response] = await client.search(request);
    
    if (!response.results) return [];

    return response.results.map(result => {
      const data = result.document?.structData || {};
      return {
        id: result.document?.id || '',
        title: (data.title as string) || '',
        uri: (data.uri as string) || '',
        snippet: (data.snippet as string) || '', // Adjust based on actual schema
        data: data
      };
    });
  } catch (error) {
    console.error('Vertex AI Search error:', error);
    return [];
  }
}
