<template>
  <div class="row position-relative">
    <span class="px-3">
      <img v-if="has(catalog, 'country.id')"
           class="catalog-flag border border-dark"
           :class="{ 'io': catalog.country.id === 'io' }"
           :src="getImg(getCatalogImage(catalog))"
           width="100%"
           height="auto"
           :alt="catalog.country.id">
    </span>
    <div class="catalog-details-table col mt-3" v-if="showObject(catalog)">
      <div class="small">
        <!-- TITLE -->
        <dl v-if="has(catalog, 'title') && showObject(catalog.title)">
          <dt>
                  <span :title="$t('message.tooltip.catalogDetails.title')"
                        data-toggle="tooltip"
                        data-placement="right">
                        {{ $t('message.metadata.title') }}
                  </span>
          </dt>
          <dd>{{ getTranslationFor(catalog.title, $route.query.locale, catalog.languages) }}</dd>
          <dd>
            <app-link :to="catalog.homepage">
              {{ catalog.homepage }}
            </app-link>
          </dd>
        </dl>
        <!-- DESCRIPTION -->
        <dl v-if="has(catalog, 'description') && showObject(catalog.description)">
          <dt>
            <span :title="$t('message.tooltip.catalogDetails.description')"
                  data-toggle="tooltip"
                  data-placement="right">
                 {{ $t('message.metadata.description') }}
            </span>
          </dt>
          <dd>{{ getTranslationFor(catalog.description, $route.query.locale, catalog.languages) }}</dd>
        </dl>
        <!-- PUBLISHER -->
        <dl v-if="has(catalog, 'publisher') && showObject(catalog.publisher)">
          <dt>
                  <span :title="$t('message.tooltip.catalogDetails.publisher')"
                        data-toggle="tooltip"
                        data-placement="right">
                          {{ $t('message.metadata.publisher') }}
                  </span>
          </dt>
          <dd v-if="has(catalog, 'publisher.name')  && showString(catalog.publisher.name)">{{ catalog.publisher.name }}</dd>
          <dd>
            <app-link v-if="has(catalog, 'publisher.homepage') && showString(catalog.publisher.homepage)" :to="catalog.publisher.homepage">
              {{ catalog.publisher.homepage }}
            </app-link>
          </dd>
          <dd>
            <app-link v-if="has(catalog, 'publisher.email') && showString(catalog.publisher.email)" :to="catalog.publisher.email">
              {{ catalog.publisher.email }}
            </app-link>
          </dd>
        </dl>
        <!-- CREATOR -->
        <dl v-if="has(catalog, 'creator') && showObject(catalog.creator)">
          <dt>{{ $t('message.metadata.creator') }}</dt>
          <dd v-if="has(catalog, 'creator.name')  && showString(catalog.creator.name)">{{ catalog.creator.name }}</dd>
          <dd>
            <app-link v-if="has(catalog, 'creator.homepage') && showString(catalog.creator.homepage)" :to="catalog.creator.homepage">
              {{ catalog.creator.homepage }}
            </app-link>
          </dd>
          <dd>
            <app-link v-if="has(catalog, 'creator.email') && showString(catalog.creator.email)" :to="catalog.creator.email">
              {{ catalog.creator.email }}
            </app-link>
          </dd>
        </dl>
        <!-- LANGUAGES -->
        <dl v-if="has(catalog, 'languages') && showArray(catalog.languages)">
          <dt>
            <span :title="$t('message.tooltip.catalogDetails.language')"
                  data-toggle="tooltip"
                  data-placement="right">
                   {{ $t('message.metadata.languages') }}
            </span>
          </dt>
          <dd v-for="lang in catalogLanguageIds" :key="lang">{{ lang }}</dd>
        </dl>
        <!-- LICENCE -->
        <dl v-if="has(catalog, 'licence') && showObject(catalog.licence)">
          <dt>{{ $t('message.catalogFacets.facets.licences') }}</dt>
          <dd v-if="has(catalog, 'licence.label') && showString(catalog.licence.label)">{{ catalog.licence.label }}</dd>
          <dd v-if="has(catalog, 'licence.description') && showString(catalog.licence.description)">{{ catalog.licence.description }}</dd>
          <dd>
            <app-link v-if="has(catalog, 'licence.resource') && showString(catalog.licence.resource)" :to="catalog.licence.resource">
              {{ catalog.licence.resource }}
            </app-link>
          </dd>
          <dd>
            <app-link v-if="has(catalog, 'licence.la_url') && showString(catalog.licence.la_url)" :to="catalog.licence.la_url">
              {{ catalog.licence.la_url }}
            </app-link>
          </dd>
        </dl>
        <!-- ISSUED -->
        <dl v-if="has(catalog, 'issued') && !isNil(catalog.issued)">
          <dt>
            <span :title="$t('message.tooltip.catalogDetails.created')"
                    data-toggle="tooltip"
                    data-placement="right">
              {{ $t('message.metadata.created') }}
            </span>
          </dt>
          <dd>{{ formatDate(catalog.issued) }}</dd>
        </dl>
        <!-- MODIFIED -->
        <dl v-if="has(catalog, 'modified') && !isNil(catalog.modified)">
          <dt :title="$t('message.tooltip.catalogDetails.updated')">
             <span :title="$t('message.tooltip.catalogDetails.updated')"
                     data-toggle="tooltip"
                     data-placement="right">
              {{ $t('message.metadata.updated') }}
            </span>
          </dt>
          <dd>{{ formatDate(catalog.modified) }}</dd>
        </dl>
        <!-- <dl v-if="has(catalog, 'availability') && !isNil(catalog.availability)">
          <dt :title="$t('message.tooltip.catalogDetails.updated')">
             <span :title="$t('message.tooltip.catalogDetails.updated')"
                     data-toggle="tooltip"
                     data-placement="right">
              {{ 'Availability' }}
            </span>
          </dt>
          <dd>{{ catalog.availability }}</dd>
        </dl> -->
        <!-- RIGHTS -->
        <dl v-if="has(catalog, 'rights') && showObject(catalog.rights)">
          <dt>{{ $t('message.metadata.rights') }}</dt>
          <dd v-if="has(catalog, 'rights.label')  && showString(catalog.rights.label)">{{ catalog.rights.label }}</dd>
          <dd>
            <app-link v-if="has(catalog, 'rights.resource') && showString(catalog.rights.resource)" :to="catalog.rights.resource">
              {{ catalog.rights.resource }}
            </app-link>
          </dd>
        </dl>
        <!-- IS PART OF -->
        <dl v-if="has(catalog, 'isPartOf') && showString(catalog.isPartOf)">
          <dt>{{ $t('message.metadata.isPartOf') }}</dt>
          <dd>{{ catalog.isPartOf }}</dd>
        </dl>
        <!-- HAS PART -->
        <dl v-if="has(catalog, 'hasPart') && showArrayOfStrings(catalog.hasPart)">
          <dt>{{ $t('message.metadata.hasPart') }}</dt>
          <dl v-for="(hasPart, i) of catalog.hasPart" :key="i">
            {{ hasPart }}
          </dl>
        </dl>
        <!-- THEME TAXONOMY -->
        <dl v-if="has(catalog, 'themeTaxonomy') && showArrayOfStrings(catalog.themeTaxonomy)">
          <dt>{{ $t('message.metadata.themeTaxonomy') }}</dt>
          <dl v-for="(themeTaxonomy, i) of catalog.themeTaxonomy" :key="i">
            {{ themeTaxonomy }}
          </dl>
        </dl>
        <!-- SPATIAL -->
        <dl v-if="has(catalog, 'spatial') && showObjectArray(catalog.spatial)">
          <dt>{{ $t('message.metadata.spatial') }}</dt>
          <dl v-for="(spatial, i) of catalog.spatial" :key="i">
            <dd v-if="has(spatial, 'coordinates') && showString(spatial.coordinates)">{{ $t('message.metadata.coordinates') }}: {{ spatial.coordinates }}</dd>
            <dd v-if="has(spatial, 'type') && showString(spatial.type)">{{ $t('message.metadata.type') }}: {{ spatial.type }}</dd>
          </dl>
        </dl>
        <!-- SPATIAL RESOURCE -->
        <dl v-if="has(catalog, 'spatialResource') && showArray(catalog.spatialResource)">
          <dt>{{ $t('message.metadata.spatialResource') }}</dt>
          <dl v-for="(spatialResource, i) of catalog.spatialResource" :key="i">
            <dd>
              <app-link v-if="showString(spatialResource)" :to="spatialResource">
                {{ spatialResource }}
              </app-link>
            </dd>
          </dl>
        </dl>
        <!-- LINKED DATA -->
        <dl>
          <div class="dropdown d-inline-block">
            <app-link class="text-dark p-0 font-weight-bold nav-link underline dropdown-toggle text-nowrap" fragment="#" role="button" id="linkedDataDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
             <span :title="$t('message.tooltip.catalogDetails.metadata')"
                           data-toggle="tooltip"
                           data-placement="right">
              {{ $t('message.catalogs.downloadAsLinkedData') }}
             </span>
            </app-link>
            <div class="dropdown-menu" aria-labelledby="linkedDataDropdownMenuLink">
              <resource-details-linked-data-button class="dropdown-item" format="rdf" text="RDF/XML" resources="catalogues" v-bind:resources-id="catalog.id"></resource-details-linked-data-button>
              <resource-details-linked-data-button class="dropdown-item" format="ttl" text="Turtle" resources="catalogues" v-bind:resources-id="catalog.id"></resource-details-linked-data-button>
              <resource-details-linked-data-button class="dropdown-item" format="n3" text="Notation3" resources="catalogues" v-bind:resources-id="catalog.id"></resource-details-linked-data-button>
              <resource-details-linked-data-button class="dropdown-item" format="nt" text="N-Triples" resources="catalogues" v-bind:resources-id="catalog.id"></resource-details-linked-data-button>
              <resource-details-linked-data-button class="dropdown-item" format="jsonld" text="JSON-LD" resources="catalogues" v-bind:resources-id="catalog.id"></resource-details-linked-data-button>
            </div>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import AppLink from "@/modules/widgets/AppLink";
import ResourceDetailsLinkedDataButton from "@/modules/widgets/ResourceDetailsLinkedDataButton";
import {
  has, isArray, isNil, isObject, isString
} from 'lodash';
import { getTranslationFor, getImg } from '../../utils/helpers';
import dateFilters from "@/modules/filters/dateFilters";

export default {
  name: "CatalogDetailsFacet",
  props: [
    "catalog",
    "catalogLanguageIds"
  ],
  components: {
    AppLink,
    ResourceDetailsLinkedDataButton
  },
  methods: {
    has,
    isNil,
    getImg,
    getTranslationFor,
    formatDate(date) {
      return dateFilters.formatEU(date);
    },
    getCatalogImage(catalog) {
      return this.$env.catalogs.useCatalogCountries
        ? `${this.$env.catalogs.defaultCatalogImagePath}/${has(catalog, 'country.id') ? catalog.country.id : this.$env.catalogs.defaultCatalogCountryID}`
        : `${this.$env.catalogs.defaultCatalogImagePath}/${has(catalog, 'id') ? catalog.id : this.$env.catalogs.defaultCatalogID}`;
    },
    showObject(object) {
      return !isNil(object) && isObject(object) && !Object.values(object).reduce((keyUndefined, currentValue) => keyUndefined && currentValue === undefined, true);
    },
    showArrayOfStrings(stringArray) {
      return this.showArray(stringArray) && stringArray.every(currentString => this.showString(currentString));
    },
    showString(string) {
      return !isNil(string) && isString(string);
    },
    showArray(array) {
      return !isNil(array) && isArray(array) && array.length > 0;
    },
    showObjectArray(objectArray) {
      return this.showArray(objectArray) && !objectArray.reduce((objectUndefined, currentObject) => objectUndefined && Object.values(currentObject).reduce((keyUndefined, currentValue) => keyUndefined && currentValue === undefined, true), true);
    }
  }
}
</script>

