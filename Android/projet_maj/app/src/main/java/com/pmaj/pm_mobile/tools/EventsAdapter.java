package com.pmaj.pm_mobile.tools;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.github.sundeepk.compactcalendarview.CompactCalendarView;
import com.github.sundeepk.compactcalendarview.domain.Event;
import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.activities.CalendarActivity;
import com.pmaj.pm_mobile.activities.ChatActivity;
import com.pmaj.pm_mobile.model.EventModel;
import com.pmaj.pm_mobile.model.Family;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.pmaj.pm_mobile.R;
import com.pmaj.pm_mobile.activities.ChatActivity;
import com.pmaj.pm_mobile.activities.LoginActivity;
import com.pmaj.pm_mobile.model.Family;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import io.socket.emitter.Emitter;


public class EventsAdapter extends RecyclerView.Adapter<EventsAdapter.ViewHolder> {

    private List<EventModel> dataset;
    private Context ActivityContext;


    private SharedPreferences mPrefs;

    // Provide a reference to the views for each data item
    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView eventTitle;
        public TextView date;
        public ImageView deleteBtn;

        public ViewHolder(View v) {
            super(v);
            eventTitle = v.findViewById(R.id.eventTitle);
            date = v.findViewById(R.id.date);
            deleteBtn = v.findViewById(R.id.icon_delete);
        }
    }

    // Provide a suitable constructor (depends on the kind of dataset)
    public EventsAdapter(List<EventModel> dataset, Context ActivityContext) {

        this.dataset = dataset;
        this.ActivityContext = ActivityContext;
        mPrefs = ActivityContext.getSharedPreferences("authToken", 0);

        LoginActivity.getSocketInstance().getmSocket().on("google_remove_event_success", onRemoveEventSuccess);
        LoginActivity.getSocketInstance().getmSocket().on("google_remove_event_err", onRemoveEventFail);

    }

    // Create new views (invoked by the layout manager)
    @Override
    public EventsAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // create a new view
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.event, parent, false);
        return new ViewHolder(v);
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {
        // - get element from your dataset at this position
        // - replace the contents of the view with that element
        if (dataset == null) {
            holder.eventTitle.setText("");
            holder.date.setText("");
        } else {


            holder.eventTitle.setText(dataset.get(position).getSummary());
            Long ms = dataset.get(position).getDate();
            Date date = new Date(ms);
            SimpleDateFormat dateformat = new SimpleDateFormat("MMM dd, yyyy HH:mm");
            holder.date.setText(dateformat.format(date));
            holder.deleteBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    LoginActivity.getSocketInstance().emitDeleteEvent(mPrefs.getString("token", ""), mPrefs.getString("family_code", ""), dataset.get(position).getEventId());
                    holder.eventTitle.setText("");
                    holder.date.setText("");
                    holder.deleteBtn.setImageResource(0);

                }
            });
        }

    }

    private Emitter.Listener onRemoveEventSuccess = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            String eventID = (String) args[0];
            EventModel eventRemoved = new EventModel();
            int index = 0;

            for (EventModel event : CalendarActivity.getlistEvents()) {
                if (event.getEventId().equals(eventID))
                    eventRemoved = event;

                index++;
            }
            if (eventRemoved != null) {

                Event ev = new Event(Color.RED, eventRemoved.getDate(), eventRemoved.getSummary());
                CalendarActivity.getCalendar().removeEvent(ev, false);
                CalendarActivity.getlistEvents().remove(index - 1);
                eventRemoved = null;
            }

            return;
        }
    };

    private Emitter.Listener onRemoveEventFail = new Emitter.Listener() {
        @Override
        public void call(Object... args) {

            final Dialog dialog = new Dialog(ActivityContext);

            dialog.setContentView(R.layout.pop_up_window_event_status);
            TextView status = (TextView) dialog.findViewById(R.id.title);
            status.setText("Ouuuups there was a problem.Please Try again !");
            dialog.show();
            return;
        }
    };

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return dataset.size();
    }


}