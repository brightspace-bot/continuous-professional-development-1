import { CpdRoutes } from '../helpers/cpdRoutes';
import { d2lfetch } from 'd2l-fetch/src/index';
import { dateParamString } from '../helpers/time-helper';
import fetchAuthFramed from 'd2l-fetch-auth/es6/d2lfetch-auth-framed';

d2lfetch.use({
	name: 'auth',
	fn: fetchAuthFramed,
	options: {
		enableTokenCache: true
	}
});

export class CpdService {
	static CpdPath(action) { return `/d2l/api/customization/cpd/1.0/${action}`; }
	static createRecord(record, files) {
		return this.postWithFilesRequest(this.CpdPath(this.Record), record, files);
	}

	static deleteRecord(recordId) {
		const request = new Request(`${this.Host}${this.CpdPath(this.Record)}/${recordId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type' : 'application/json'
			}
		});
		return d2lfetch.fetch(request);
	}

	static getJobTitleDefaults(page) {
		let api_path = this.CpdPath(this.Job);
		api_path += `?pageNumber=${page}`;
		return this.getRequest(api_path);
	}

	static getMethods() {
		return this.getRequest(this.CpdPath(this.Method));
	}
	static getMyTeam(page, filters) {
		let api_path = this.CpdPath(this.Team);
		api_path += `?pageNumber=${page}`;
		if (filters) {
			const { Name } = filters;
			if (Name && Name.value) api_path += `&searchTerm=${Name.value}`;
		}
		return this.getRequest(api_path);
	}

	static getPendingRecords(page, filters) {
		let api_path = this.CpdPath(this.Pending);
		api_path += `?pageNumber=${page}`;
		if (filters) {
			const { Name, StartDate, EndDate } = filters;
			if (Name && Name.value) api_path += `&awardName=${Name.value}`;
			if (StartDate && StartDate.value) api_path += `&startDate=${dateParamString(StartDate.value)}`;
			if (EndDate && EndDate.value) api_path += `&endDate=${dateParamString(EndDate.value, true)}`;
		}
		return this.getRequest(api_path);
	}

	static getProgress() {
		const data =  {
			structured: {
				numerator: 30,
				denominator: 19
			},
			unstructured: {
				numerator: 12,
				denominator: 15
			}
		};
		return Promise.resolve(data);
	}

	static getQuestions() {
		return this.getRequest(this.CpdPath(this.Question));
	}
	static getRecord(recordId) {
		const base_path = `${this.CpdPath(this.Record)}/${recordId}`;
		return this.getRequest(base_path)
			.then(body => {
				if (body.Attachments) {
					body.Attachments.Files = body.Attachments.Files.map(file => {
						return {
							id: file.Id,
							name: file.Name,
							size: file.Size,
							href: `${window.data.fraSettings.valenceHost}${file.Href}`
						};
					});
				}
				return body;
			});
	}
	static getRecordSummary(page, viewUserId, filters) {
		let base_path = `${this.CpdPath(this.Record)}?pageNumber=${page}`;

		if (filters) {
			const { Subject, Method, Name, StartDate, EndDate } = filters;
			if (Subject.value && Subject.enabled) base_path += `&subject=${Subject.value}`;
			if (Method.value && Method.enabled) base_path += `&method=${Method.value}`;
			if (Name.value) base_path += `&name=${Name.value}`;
			if (StartDate.value) base_path += `&startdate=${dateParamString(StartDate.value)}`;
			if (EndDate.value) base_path += `&enddate=${dateParamString(EndDate.value, true)}`;
		}

		if (viewUserId) {
			base_path += `&userId=${viewUserId}`;
		}

		return this.getRequest(base_path);
	}
	static getRequest(base_path) {
		const getRequest = new Request(`${this.Host}${base_path}`, {
			method: 'GET',
			headers: {
				'Content-Type' : 'application/json'
			}
		});
		return d2lfetch.fetch(getRequest).then(r => r.json());
	}
	static getSubjects() {
		const base_path = '/d2l/api/customization/cpd/1.0/subject';
		return this.getRequest(base_path);
	}
	static getSubjectTargets(jobTitle) {
		if (!jobTitle) {
			return this.getRequest('/d2l/api/customization/cpd/1.0/target/user');
		}
		return this.getRequest(`/d2l/api/customization/cpd/1.0/target/job?jobTitle=${jobTitle}`);
	}
	static getTypes() {
		return [ {
			Id: 0,
			Name: 'Unstructured'
		},
		{
			Id: 1,
			Name: 'Structured'
		}];
	}
	static getUserInfo(userId) {
		return this.getRequest(this.CpdPath(`${this.Team}/username/${userId}`));
	}
	static get Host() { return window.data.fraSettings.valenceHost; }
	static get Job() { return 'target/job'; }
	static get Method() { return 'method'; }
	static get Pending() { return 'pending'; }
	static postJsonRequest(base_path, object) {
		const postRequest = new Request(`${base_path}`, {
			method: 'POST',
			headers: {
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify(object)
		});
		return d2lfetch.fetch(postRequest);
	}
	static postWithFilesRequest(base_path, object, files) {
		const data = new FormData();
		data.append('record', JSON.stringify(object));
		for (const file of files) {
			data.append('file', file, file.name);
		}
		const postRequest = new Request(`${this.Host}${base_path}`, {
			method: 'POST',
			body: data
		});
		return d2lfetch.fetch(postRequest);
	}

	static putWithFilesRequest(base_path, object, files, removedFiles) {
		const data = new FormData();
		data.append('record', JSON.stringify(object));
		data.append('deletedFiles', JSON.stringify(removedFiles));
		for (const file of files) {
			data.append('file', file, file.name);
		}
		const postRequest = new Request(`${this.Host}${base_path}`, {
			method: 'PUT',
			body: data
		});
		return d2lfetch.fetch(postRequest);
	}

	static get Question() { return 'question'; }
	static get Record() { return 'record'; }
	static get Subject() { return 'subject'; }
	static get Target() {return 'target';}
	static get Team() { return 'team'; }

	static updateRecord(recordId, record, files, removedFiles) {
		return this.putWithFilesRequest(`${this.CpdPath(this.Record)}/${recordId}`, record, files, removedFiles);
	}

	static updateTarget(jobTitle, target) {
		if (jobTitle) {
			return this.postJsonRequest(CpdRoutes.Path(CpdRoutes.JobTarget), target);
		} else {
			return this.postJsonRequest(CpdRoutes.Path(CpdRoutes.UserTarget), target);
		}
	}
}
