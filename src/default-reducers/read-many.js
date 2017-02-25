import {
  updateManyResourcesMeta, xhrStatuses, initialResourceMetaState,
  upsertManyResources
} from '../utils';

export function retrieveMany(idAttr, state) {
  return {
    ...state,
    resourcesListMeta: {
      ...state.resourcesListMeta,
      retrievingStatus: xhrStatuses.PENDING
    }
  };
}

export function retrieveManyFail(idAttr, state) {
  return {
    ...state,
    resourcesListMeta: {
      ...state.resourcesListMeta,
      retrievingStatus: xhrStatuses.FAILED
    }
  };
}

export function retrieveManySucceed(idAttribute, state, action) {
  const resources = action.resources;
  const ids = resources.map(r => r[idAttribute]);
  const replace = typeof action.replace !== 'undefined' ? action.replace : true;

  let newResources;
  if (!replace) {
    newResources = upsertManyResources({
      resources: state.resources,
      replace: false,
      newResources: resources,
      idAttribute
    });
  } else {
    newResources = resources;
  }

  return {
    ...state,
    resources: newResources,
    // We have new resources, so we need to update their meta state with the
    // initial meta state.
    resourcesMeta: updateManyResourcesMeta({
      resourcesMeta: state.resourcesMeta,
      newMeta: initialResourceMetaState,
      ids, replace
    }),
    resourcesListMeta: {
      ...state.resourcesListMeta,
      retrievingStatus: xhrStatuses.SUCCEEDED
    }
  };
}

export function retrieveManyAbort(idAttr, state) {
  return {
    ...state,
    resourcesListMeta: {
      ...state.resourcesListMeta,
      retrievingStatus: xhrStatuses.ABORTED
    }
  };
}

export function retrieveManyReset(idAttr, state) {
  return {
    ...state,
    resourcesListMeta: {
      ...state.resourcesListMeta,
      retrievingStatus: xhrStatuses.NULL
    }
  };
}
